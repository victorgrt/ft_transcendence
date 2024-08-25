
function showMatchHistory(){
	console.log("Display match history");
  if (matchHistoryBool === true)
  {
    console.log("Disabling match history");
    matchHistoryDiv.style.visibility = 'hidden'
    matchHistoryBool = false;
    return;
  }
	else
	{
		console.log("Activating match history");
		matchHistoryDiv.style.visibility = 'visible';
		matchHistoryDiv.style.opacity = '1';
		matchHistoryBool = true;
	}
}