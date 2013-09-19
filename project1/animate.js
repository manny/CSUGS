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

function paddle(){
	
	this.width = 75;
	this.height = 12;
	
	//upper left corner of paddle
	this.x = 100;
	this.y = 540;

	//lower right corner of paddle
	this.x2 = this.x+this.width;
	this.y2 = this.y+this.height;

	this.color = "silver";

	this.update = function(){
		if(Key.isDown(Key.A)) this.moveLeft();
		if(Key.isDown(Key.D)) this.moveRight();
		if(Key.isDown(Key.K)) this.color = "silver";
		if(Key.isPressed(Key.L)) this.color = "purple"
		this.draw();
	};

	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	this.draw();
	
	this.moveLeft = function(){
		if(this.x>0){
			this.x = this.x - 9.0;
			this.x2 = this.x2 - 9.0;
		}
	};
	
	this.moveRight = function(){
		if(this.x2 < canvasW){
			this.x = this.x + 9.0;
			this.x2 = this.x2 + 9.0;
		}
	};
};

function ball(x, y, weight, vx, color){
	
	this.width = 20;
	this.height = 20;
	this.radius = this.width/2;

	//upper left coordinates
	this.x = x;
	this.y = y;

	//lower right coordinates
	this.x2 = this.x + this.width;
	this.y2 = this.y + this.height
	
	// x and y velocities (+y = down)
	
	this.vx = vx;
	this.vy = 0.0;

	this.acceleration = 0.15;
	this.weight = weight;

	this.color =  color;

	this.update = function(){
		this.motion();
		this.collision();
		this.draw();
	};
	
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x + 10, this.y + 10, this.radius, 0, Math.PI*2, true);
		ctx.fill();
	};

	this.motion = function(){
		this.vy = this.vy + this.weight;
		this.y = this.y + this.vy;
		this.y2 = this.y2 + this.vy;
		//console.log("velocity: " + this.vy);
		this.x = this.x + this.vx;
		this.x2 = this.x2 + this.vx;
	};

	this.collision = function(){
		if(this.y2 > paddle1.y && this.y2 <paddle1.y2  && (this.x2 > paddle1.x && this.x < paddle1.x2)){
			this.bounceY();
		}
		//if(this.y2 > paddle1.y -1) this.bounceY();	
		if(this.x < 0 || this.x2 > canvasW) this.bounceX();
	};

	this.bounceY = function(){
		//console.log(this.vy);
		if(this.color != paddle1.color){
			this.vy = -0.67 * this.vy;
		}else{
			this.vy = -1.011 * this.vy;
		}
	};

	this.bounceX = function(){
		this.vx = this.vx * -1.0
	}
	
};

/*
Key helper class that keeps track of keys up and down
in _pressed array
*/

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

var paddle1 = new paddle(); 
var ball1 = new ball(50, -100, 0.09, 1,"silver");
var ball2 = new ball(150, 0, 0.08, -1.2,"purple");
var ball3 = new ball(250, 100, 0.06, 1.3,"silver");
var ball4 = new ball(350, -100, 0.05, 1.2,"purple");

var draw2 = false;
var draw3 = false;
var draw4 = false;

setTimeout(function(){
	draw2 = true;
}, 2000);

setTimeout(function(){
	draw3 = true
}, 4000);

setTimeout(function(){
	draw4 = true;
}, 8000);


setInterval(function(){
    //clears whole screen before objects are redrawn
    ctx.clearRect(0, 0, 400, 600);
	paddle1.update();
	ball1.update();
	if(draw2) ball2.update();
	if(draw3) ball3.update();
	if(draw4) ball4.update();
}, 25);


//Event listeners that check for keyboard input
window.addEventListener('keypress', function(event) {Key.onKeypress(event); }, false); 
window.addEventListener('keyup', function(event) {Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) {Key.onKeydown(event); }, false);

