
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
const inputSearchFriend = document.getElementById("input_search_friend");
const resultBox = document.getElementById("result_box");
// const searchUserSuccess = document.getElementById("search_user_success");
const resultUsername= document.getElementById("result_name");
const resultStatus= document.getElementById("result_status");
const resultAvatar = document.getElementById("result_avatar");
const friendsList = document.getElementById("friends_list");
const searchFriendError = document.getElementById('search_friend_error');
const addButton = document.getElementById('add_button');
var compteur_notifs = document.getElementById("nb_notifs").textContent;
const baseSrc = document.getElementById("result_avatar")?.src;
const friendsBox = document.getElementById("result_box");

// ------------ TOURNAMENT ELEMENTS ---------
var tournamentPlayersList;
var tournamentSemiFinals;
var tournamentFinal;
var tournamentSmallFinal;
var tournamentRanking;

// ------------ GAME VARIABLES ---------
var socket;
var gamedata;

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