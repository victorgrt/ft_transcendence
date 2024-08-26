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
var settings = document.getElementById("settingsForm");

// ------------ Friends div---------
var inputSearchFriend = document.getElementById("input_search_friend");
var resultBox = document.getElementById("result_box");
var resultUsername= document.getElementById("result_name");
var resultStatus= document.getElementById("result_status");
var resultAvatar = document.getElementById("result_avatar");
var friendsList = document.getElementById("friends_list");
var searchFriendError = document.getElementById('search_friend_error');
var addButton = document.getElementById('add_button');
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
let keys = {};


// ------------ OTHER ---------
var matchHistoryBool = true;
var friendsVisible = false;
var countdown;
var gameover;
var notifs_fetched;
var id_to_accept;

// CAMERA UTILS
var duration = 2000;
var initialCameraPosition = new THREE.Vector3(12, 5, 12);
var initialCameraLookAt = new THREE.Vector3(0, 0, 0);
// ------------ HEADER VARIABLES ---------
var headerUser;
var headerMatchHistory;
var headerFriends;
var headerSettings;
var headerLogout;
var dontClick = false;

var loginVisible;
var registerVisible;
var menuPongVisible;
var notifsVisible = false;
var paramsVisible = false;
var statsVisible = false;
var friendsVisible = true;

var isZoomed;
var isZooming;
var couchZoomed;

var base_color_couch;