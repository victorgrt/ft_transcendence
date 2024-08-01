var statsVisible = false;

async function showStats() {
    if (statsVisible) {
        zoomBack();
        statsDiv.style.visibility = 'hidden';
        statsVisible = false;
    } else {
        statsDiv.style.visibility = 'visible';
        statsDiv.style.opacity = '1';
        await updateUIForStats(); // Now waits for the stats to be updated before proceeding
        showElement(goBackButton);
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
			rightstats.innerHTML = `
				<p class="stats_username">${username}</p>
				<p style="color:green;">${win}</p>
				<p style="color:red;">${lost}</p>
				<p>${ratio}%</p>
		`;
        } else {
            console.log('Failed to fetch user stats:', statsFetched.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}