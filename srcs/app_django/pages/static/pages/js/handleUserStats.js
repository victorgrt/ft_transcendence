var statsVisible = false;
console.log("Defined showStats");
async function showStats() {
    if (statsVisible) {
        // zoomBack();
        statsDiv.style.visibility = 'hidden';
        statsVisible = false;
    } else {
        statsDiv.style.visibility = 'visible';
        statsDiv.style.opacity = '1';
        await updateUIForStats(); // Now waits for the stats to be updated before proceeding
        // showElement(goBackButton);
        statsVisible = true;
    }
}

async function updateUIForStats() {
    console.log("Updating UI for stats");
    const userDiv = document.getElementById('user_stats');
    // Assuming avatar, username, and friends are defined globally or fetched elsewhere

    try {
        const response = await fetch('/account/stats/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const statsFetched = await response.json();
        if (statsFetched.success) {
            const win = statsFetched.wins;
            const lost = statsFetched.losses;
			const username = statsFetched.username;
			const avatar = statsFetched.avatar;
			const ratio = statsFetched.ratio;
			const rightstats = document.getElementById('rightstats');
			const friend_count = statsFetched.friend_count;
			console.log("Friend count: ", friend_count);
			rightstats.innerHTML = `
				<p class="stats_username" style="font-size: 40px;">${username}</p>
				<p  style="font-size: 30px;">friends: ${friend_count}</p>
				<p style="color:green; font-size: 30px;">wins: ${win}</p>
				<p style="color:red; font-size: 30px;">losses: ${lost}</p>
				<p style="color: yellow; font-size: 30px;">win ratio: ${ratio}%</p>
		`;
        } else {
            console.log('Failed to fetch user stats:', statsFetched.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}