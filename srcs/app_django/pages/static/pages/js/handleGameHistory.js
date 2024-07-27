
var statsVisible = false;
function showGameHistory(){
	console.log("Display or not match history");
    if (statsVisible === true)
    {
		console.log("Disabling match history display");
        zoomBack();
		GHDiv.style.visibility = 'hidden'
		statsVisible = false;
        return;
    }
	else
	{
		console.log("Activating match history display");
		GHDiv.style.visibility = 'visible';
		GHDiv.style.opacity = '1';
		statsVisible = true;
	}
}