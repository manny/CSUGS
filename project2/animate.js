var canvasH = 400;
var canvasW = 600;

/*
setTimeout(function(){
    console.log("world");

}, 3000);

console.log("hello");
*/

// grabs canvas by ID from index.html
var canvas = document.getElementById('screen');

//getContext makes context object that is filled with functions for drawing
var ctx = canvas.getContext('2d');

function drawMap(){

	ctx.font = "12pt Arial";
	ctx.fillStyle = "white";
	var y = 20;
	for(var x = 0; x<600; x=x+15){
		for(var y = 0; y<400; y=y+15){
			if(y%2==0){
				ctx.fillText(" w ", x-4, y+3);
			}else{
				ctx.fillText(" . ", x, y);
			}

			console.log("print .");
		}
	}

	console.log("draw map");
}




var Key = {
    //array that keeps track of key presses
    _pressed: {},

    //controls
    K: 75,     //cycle color up
    L: 76,      // cylce color down
    A: 65,		//paddle left
	D: 68,		//paddle right
    
    //returns if key is down/true or up/false)
    isDown: function(keyCode){
        return this._pressed[keyCode];
    },
    //sets array index to true when key is pressed
    onKeydown: function(event){
        this._pressed[event.keyCode] = true;
    },
    //unsets array index when key is released
    onKeyup: function(event){
        delete this._pressed[event.keyCode];
    },
    //sets array index when button is presses, unsets if unpressed
    onKeypress: function(event){
        if(!this._pressed[event.which]){
            delete this._pressed[event.which];  //use event.which for firefox keyPress
        }else{                                  //event.keyCode for IE onKeyPress
            this._pressed[event.which] = true;
        }
    },
    //returs if key is pressed down
    isPressed: function(keyCode){
        return this._pressed[keyCode];
    }
};

drawMap();
/*
setInterval(function(){
    //clears whole screen before objects are redrawn
    ctx.clearRect(0, 0, canvasW, canvasH);
	drawMap();
}, 500);

*/
//Event listeners that check for keyboard input
window.addEventListener('keypress', function(event) {Key.onKeypress(event); }, false); 
window.addEventListener('keyup', function(event) {Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) {Key.onKeydown(event); }, false);

