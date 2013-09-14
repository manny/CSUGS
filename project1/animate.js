var canvasH = 600;
var canvasW = 400;

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

function paddle(x, y){
	
	this.width = 75;
	this.height = 12;
	
	//upper left corner of paddle
	this.x = x;
	this.y = y;

	//lower right corner of paddle
	this.x2 = this.x+this.width;
	this.y2 = this.y+this.height;

	this.red = 0;
	this.green = 0;
	this.blue = 0;

	this.update = function(){
		if(Key.isDown(Key.A)) this.moveLeft();
		if(Key.isDown(Key.D)) this.moveRight();
		this.draw();
	};

	this.draw = function(){
		ctx.fillStyle = "rgb(150, 0 ,150)";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	this.draw();
	
	this.moveLeft = function(){
		if(this.x>0){
			this.x = this.x - 3;
			this.x2 = this.x2 - 3
		}
	};
	
	
	this.moveRight = function(){
		if(this.x2 < canvasW){
			this.x = this.x + 3;
			this.x2 = this.x2 + 3;
		}
	};

};


/*
Key helper class that keeps track of keys up and down
in _pressed array
*/

var Key = {
    //array that keeps track of key presses
    _pressed: {},

    //controls
    W: 87,      //cycle color up
    S: 83,      // cylce color down
    A: 65,		//paddle left
	D: 68,		//paddle right
	
	P: 80,      //pause/unpause ball
    
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

var paddle1 = new paddle(100, 540); 

setInterval(function(){
    //clears whole screen before objects are redrawn
    ctx.clearRect(0, 0, 400, 600);
	paddle1.update();

}, 25);


//Event listeners that check for keyboard input
window.addEventListener('keypress', function(event) {Key.onKeypress(event); }, false); 
window.addEventListener('keyup', function(event) {Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) {Key.onKeydown(event); }, false);

