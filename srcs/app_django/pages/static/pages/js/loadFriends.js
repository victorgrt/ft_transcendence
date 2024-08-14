function loadFriendElements(){
	inputSearchFriend = document.getElementById("input_search_friend");
	resultBox = document.getElementById("result_box");
	resultUsername= document.getElementById("result_name");
	resultStatus= document.getElementById("result_status");
	resultAvatar = document.getElementById("result_avatar");
	friendsList = document.getElementById("friends_list");
	searchFriendError = document.getElementById('search_friend_error');
	addButton = document.getElementById('add_button');
	baseSrc = document.getElementById("result_avatar")?.src;
	friendsBox = document.getElementById("result_box");
	toUser = "";
}

function loadFriends(){
	console.log("loading friends");
	loadFriendElements();
	if (inputSearchFriend) 
		inputSearchFriend.addEventListener('input', handleInput)
}
