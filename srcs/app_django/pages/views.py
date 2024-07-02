from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser  # Adjust the import path according to your project structure

# # Hello World
# def home_page_view(request):
#     print(request)
#     return HttpResponse("Hello, World!")


#   ----            FRONT
def starting_page(request):
    return render(request, 'pages/base.html')

def pong(request):
    return render(request, 'pages/partials/pong.html')

def home_page(request):
    return render(request, 'pages/partials/home_page.html')

def chat(request):
    return render(request, 'pages/partials/chat.html')

def register(request):
    return render(request, 'pages/partials/register.html')

@csrf_exempt  # Only for demonstration; consider CSRF protection for production
def createUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Create a new user instance and save it to the database
        user = CustomUser.objects.create_user(username=username, email=email, password=password)
        user.save()

        return HttpResponse("Registration successful!")
    return HttpResponse("This endpoint expects a POST request.")
