function loadFriendElements(){
	inputSearchFriend = document.getElementById("input_search_friend");
	resultBox = document.getElementById("result_box");
	resultUsername= document.getElementById("result_name");
	resultStatus= document.getElementById("result_status");
	resultAvatar = document.getElementById("result_avatar");
	friendsList = document.getElementById("friends_list");
	searchFriendError = document.getElementById('search_friend_error');
	addButton = document.getElementById('add_button');
	compteur_notifs = document.getElementById("nb_notifs").textContent;
	baseSrc = document.getElementById("result_avatar")?.src;
	friendsBox = document.getElementById("result_box");
	toUser = "";
	console.log("inputSearchFriend:", inputSearchFriend);
	console.log("resultBox:", resultBox);
	console.log("resultUsername:", resultUsername);
	console.log("resultStatus:", resultStatus);
	console.log("resultAvatar:", resultAvatar);
	console.log("friendsList:", friendsList);
	console.log("searchFriendError:", searchFriendError);
	console.log("addButton:", addButton);
	console.log("baseSrc:", baseSrc);
	console.log("friendsBox:", friendsBox);
	console.log("toUser:", toUser);
}

function loadFriends(){
	console.log("loading friends");
	loadFriendElements();
	console.log("HEREL", inputSearchFriend);
	if (inputSearchFriend) 
	{
		inputSearchFriend.addEventListener('input', handleInput)
		console.log("added event listener on friends");
	}
}
