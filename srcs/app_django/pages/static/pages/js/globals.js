
// ------------ DOM ELEMENTS ---------

const loginForm = document.getElementsByClassName("login_form")[0];
const registerForm = document.getElementsByClassName("register_form")[0];
const goBackButton = document.getElementById("footer");
const header = document.getElementById("header");
const contentdiv = document.getElementById("content");
const statsDiv = document.getElementById("user_stats");
const matchHistoryDiv = document.getElementById("match_history");
const GHDiv = document.getElementById("game_history");
const friendsDiv = document.getElementById("friends");
const notifDiv = document.getElementById("notif");
const paramsDiv = document.getElementById("change_prof");
const menuPongDiv = document.getElementById("menuPongDiv");
const notifsDiv = document.getElementById("notifications");

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
const baseSrc = document.getElementById("result_avatar").src;

// ------------ GAME VARIABLES ---------
var socket;
var gamedata;

// ------------ OTHER ---------
var matchHistoryBool = false;
var friendsVisible = false;
var countdown;
