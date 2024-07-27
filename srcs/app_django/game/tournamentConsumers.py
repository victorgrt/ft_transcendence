import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
django.setup()

# Now we can safely import and use Django models and other components
import json
import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from .game_manager import game_manager

# Wrap the synchronous Django ORM calls with database_sync_to_async

@database_sync_to_async
def get_session(session_key):
    return Session.objects.get(session_key=session_key)

@database_sync_to_async
def get_user(uid):
    return get_user_model().objects.get(pk=uid)

# Function to get the user object from the session key
async def get_user_from_session_key(session_key):
    try:
        session = await get_session(session_key)
        uid = session.get_decoded().get('_auth_user_id')
        user = await get_user(uid)
        return user
    except ObjectDoesNotExist:
        return None

class TournamentConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tournament = None  # Initialize self.game to None
        self.tournament_id = None  # Initialize self.game_id to None
        self.user = None  # Initialize self.player to None
        self.is_added_to_group = False  # Initialize self.player to None

    async def connect(self):

        # Authenticate the user
        cookies_header = next((value for (key, value) in self.scope['headers'] if key == b'cookie'), None)
        self.user = None  # Initialize user as None
        if cookies_header:
            cookies = dict(cookie.split(b"=") for cookie in cookies_header.split(b"; "))
            session_key = cookies.get(b'sessionid')
            if session_key:
                session_key = session_key.decode('utf-8')  # Ensure session_key is a string
                self.user = await get_user_from_session_key(session_key)
                print(self.user)
            else:
                print("Session key not found in cookies")
        else:
            print("No cookies found")

        # If user is not found, reject the connection
        if not self.user:
            print("Authentication failed. Closing connection.")
            await self.close()
            return  # Stop further execution

        # Handle tournament connection
        tournament_id = self.scope['url_route']['kwargs']['game_id']  # Assuming tournament_id is passed as game_id
        self.game_id = tournament_id  # You might want to use a different attribute for clarity
        print(f"Connecting to tournament {self.game_id}")

        # Get or create the tournament
        self.tournament = game_manager.get_tournament(tournament_id)
        if not self.tournament:
            self.tournament = game_manager.create_tournament(tournament_id)
        
        # Add the player to the tournament
        self.tournament.add_player(self.tournament, self.user)

        # Add the player to the group
        await self.channel_layer.group_add(self.game_id, self.channel_name)
        self.is_added_to_group = True

        await self.accept()


    async def disconnect(self, close_code):
        if self.tournament:
            self.tournament.remove_player(self)
        # if not self.game.players:
        #     game_manager.remove_game(self.game_id)
        if self.is_added_to_group:
            await self.channel_layer.group_discard(self.game_id, self.channel_name);

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

    async def game_update(self, event):
        message = event['message']
        # Assuming event['timestamp'] is a UNIX timestamp
        print(f"Received message: {message} at time : {datetime.datetime.now().time()}")
        await self.send(text_data=json.dumps({'game_state': message}))

    async def countdown(self, event):
        message = event['message']
        print(f"Received message: {message} at time : {datetime.datetime.now().time()}")
        await self.send(text_data=json.dumps({'countdown': message}))

