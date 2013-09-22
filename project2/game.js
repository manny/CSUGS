setInterval(function(){
    //clears whole screen before objects are redrawn
    ctx.clearRect(0, 0, canvasW, canvasH);
	myMap.drawPawns();
	myMap.drawMap();
}, 80);
