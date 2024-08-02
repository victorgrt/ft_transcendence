
// ------------ DOM ELEMENTS ---------

var loginForm = document.getElementsByClassName("login_form")[0];
var registerForm = document.getElementsByClassName("register_form")[0];
var goBackButton = document.getElementById("footer");
var header = document.getElementById("header");
var contentdiv = document.getElementById("content");
var statsDiv = document.getElementById("user_stats");
var matchHistoryDiv = document.getElementById("match_history");
var GHDiv = document.getElementById("game_history");
var friendsDiv = document.getElementById("friends");
var notifDiv = document.getElementById("notif");
var paramsDiv = document.getElementById("change_prof");
var menuPongDiv = document.getElementById("menuPongDiv");
var notifsDiv = document.getElementById("notifications");

// ------------ Friends div---------
var inputSearchFriend = document.getElementById("input_search_friend");
var resultBox = document.getElementById("result_box");
var resultUsername= document.getElementById("result_name");
var resultStatus= document.getElementById("result_status");
var resultAvatar = document.getElementById("result_avatar");
var friendsList = document.getElementById("friends_list");
var searchFriendError = document.getElementById('search_friend_error');
var addButton = document.getElementById('add_button');
var compteur_notifs = document.getElementById("nb_notifs").textContent;
var baseSrc = document.getElementById("result_avatar")?.src;
var friendsBox = document.getElementById("result_box");
var toUser;

// ------------ TOURNAMENT ELEMENTS ---------
var tournamentPlayersList;
var tournamentSemiFinals;
var tournamentFinal;
var tournamentSmallFinal;
var tournamentRanking;

// ------------ GAME VARIABLES ---------
var socket;
var gamedata;
var isAnimating = false;
var id;
var pov_camera;
var set_camera = 0;
var score_player_1 = 0;
var score_player_2 = 0;


// ------------ OTHER ---------
var matchHistoryBool = true;
var friendsVisible = false;
var countdown;
var gameover;
var notifs_fetched;
var id_to_accept;

// ------------ HEADER VARIABLES ---------
var headerUser;
var headerMatchHistory;
var headerFriends;
var headerSettings;
var headerLogout;