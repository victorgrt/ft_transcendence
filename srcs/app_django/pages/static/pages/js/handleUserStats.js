
var statsVisible = false;
function showStats(){
    if (statsVisible === true)
    {
        zoomBack();
		statsDiv.style.visibility = 'hidden'
		statsVisible = false;
        return;
    }
	else
	{
		statsDiv.style.visibility = 'visible';
		statsDiv.style.opacity = '1';
		statsVisible = true;
		// updateUIForStats() 
		showElement(goBackButton);
	}
}


// function updateUIForStats() 
// {
// 	console.log("Updating UI for stats");
//     const userDiv = document.getElementById('user_stats');

// 	// Retrieve data from data attributes
// 	const username = userDiv.getAttribute('data-username');
// 	const avatar = userDiv.getAttribute('data-avatar');
// 	const friends = userDiv.getAttribute('data-friends');
// 	const win = userDiv.getAttribute('data-win');
// 	const lost = userDiv.getAttribute('data-lost');

//     userDiv.innerHTML =
// 	`
// 		<div id="leftstats">
// 			${avatar ? `<ul id="stats"><img src="staticfiles/pages/img_avatars/${avatar}" id="avatar"></ul>` : ''}
// 		</div>
// 		<div id="rightstats">
// 			<ul id="stats_username">${username}</ul>
// 			${friends ? `<ul id="stats">0 amis</ul>` : `<ul id="stats">${friends.count} amis</ul>`}
// 			<ul id="stats">${win}</ul>
// 			<ul id="stats">${lost}</ul>
// 		</div>
//     `;
// }