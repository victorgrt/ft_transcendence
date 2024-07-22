
// ------------ DOM ELEMENTS ---------

const loginForm = document.getElementsByClassName("login_form")[0];
const registerForm = document.getElementsByClassName("register_form")[0];
const goBackButton = document.getElementById("footer");
const header = document.getElementById("header");
const contentdiv = document.getElementById("content");
const statsDiv = document.getElementById("user_stats");
const friendsDiv = document.getElementById("friends");
const paramsDiv = document.getElementById("change_prof");
const menuPongDiv = document.getElementById("menuPongDiv");
const notifsDiv = document.getElementById("notifications");
var compteur_notifs = document.getElementById("nb_notifs").textContent;

// ------------ GAME VARIABLES ---------
var socket;
var gamedata;