var canvasH = 420;

var canvasW = 700;

var soundtrack = AudioFX('sounds/spooky.ogg',{loop: true}); //ogg sound files supported in firefox
var hitFX = AudioFX('sounds/slash.ogg', {pool: 10});
var missFX = AudioFX('sounds/miss.ogg', {pool: 10});
// grabs canvas by ID from index.html
var canvas = document.getElementById('screen');

//getContext makes context object that is filled with functions for drawing
var ctx = canvas.getContext('2d');

$(document).ready(function(e){
	$(window).keypress(function(event){
		console.log(event.which);
		//movement
		if(event.which == 97) player1.move("left");
		if(event.which == 100) player1.move("right");
		if(event.which == 119) player1.move("up");
		if(event.which == 115) player1.move("down");
		//combat
		if(event.which == 106) player1.attack("left");
		if(event.which == 108) player1.attack("right");
		if(event.which == 105) player1.attack("up");
		if(event.which == 107) player1.attack("down");
	});
});

var rows = 26;
var cols = 43;

String.prototype.replaceAt=function(index, character){
	return this.substr(0, index) + character + this.substr(index+character.length);
}

function pawn(character, xCoor, yCoor, xAdj, yAdj, color, type){
	
	this.character = character;
	this.xCoor = xCoor;
	this.yCoor = yCoor;
	this.xAdj = xAdj;
	this.yAdj = yAdj;
	this.color = color;
	
	this.underChar = myMap.stringArray[xCoor][yCoor];	
	
	this.canAttack = true;
	this.health = 5;
	
	this.type = type;

	myMap.stringArray[this.xCoor][this.yCoor] = this.character;
	myMap.pawnIndex[this.xCoor][this.yCoor] = true;

	this.move = function(direction){
		if(this.health<1){
			return;
		}
		var xdir = 0;
		var ydir = 0;
		switch(direction){
			case "left": 
				if(this.xCoor !=0) xdir=-1;
				break;
			case "right": 
				if(this.xCoor !=cols-1) xdir=1;
				break;
			case "up": 
				if(this.yCoor != 0) ydir=-1;
				break;
			case "down": 
				if(this.yCoor !=rows-1) ydir=1;
				break;
		}
		if(myMap.stringArray[this.xCoor+xdir][this.yCoor+ydir] == " . "){
			myMap.pawnIndex[this.xCoor][this.yCoor] = 0;
			myMap.pawnIndex[this.xCoor+xdir][this.yCoor+ydir] = this;
			
			myMap.stringArray[this.xCoor][this.yCoor] = this.underChar;
			//update position
			
			this.xCoor = this.xCoor + xdir;
			this.yCoor = this.yCoor + ydir;
			
			this.underChar = myMap.stringArray[this.xCoor][this.yCoor];
			myMap.stringArray[this.xCoor][this.yCoor] = this.character;	
			this.refreshPosition();	
		}
	}

	this.getColor = function(){
		if(this.health < 2){
			return "red";
		}else if(this.health <4){
			return "yellow";
		}
		return this.color;
	};

	this.refreshPosition = function(){
		this.xPosition = this.xCoor*16+2+this.xAdj;
		this.yPosition = this.yCoor*16+10+this.yAdj;	
	};
	this.refreshPosition();
	
	this.attack = function(direction){
		if(this.health<=0){
			return;
		}
		ctx.font = "11pt Arial";
		ctx.fillStyle = this.color;
		var xdir = 0;
		var ydir = 0;
		if(this.canAttack){
			switch(direction){
				case "left":
					xdir = -1;
					ctx.fillText("  <", this.xPosition - 16 ,this.yPosition);
					break;
				case "right":
					xdir = 1;
					ctx.fillText(">  ", this.xPosition + 16 ,this.yPosition);
					break;
				case "up":
					ydir = -1
					ctx.fillText(" ^ ", this.xPosition+2 ,this.yPosition - 12);
					break;
				case "down":
					ydir = 1;
					ctx.fillText(" v ", this.xPosition+2,this.yPosition + 12);
					break;
			}
			if(this.type =="player") this.canAttack = false;
			setTimeout(function(){
				player1.canAttack = true;
				//console.log("readytoattack " + player1.canAttack);
			},  500);
		}else{
			console.log("cooling down");
		}
		var target = myMap.pawnIndex[this.xCoor+xdir][this.yCoor+ydir];
		//if you hit an enemy
		if(target!=0 && (xdir !=0 || ydir!=0) && (target.type == "enemy" || target.type == "player")){
			console.log("hit!");
			hitFX.play();
			target.health--;
			if(target.health == 0){
				myMap.stringArray[target.xCoor][target.yCoor] = target.underChar;
				myMap.pawnIndex[target.xCoor][target.yCoor] = 0;
				console.log("dead");
			}
		}else if(target ==0){
			//console.log("miss");	
			missFX.play();
		}
	};
};

function map(){
	
	this.stringArray = new Array(rows);
	for(var i = 0; i < cols; i++){
		this.stringArray[i] = new Array(rows);
		for(var j = 0; j < rows; j++){
			this.stringArray[i][j] = "   ";
		}
	}

	this.pawnIndex = new Array(rows);
	for(var i = 0; i < cols; i++){
		this.pawnIndex[i] = new Array(rows);
		for(var j = 0; j < rows; j++){
			this.pawnIndex[i][j] = 0;
		}
	}
	
	this.drawPawns = function(){
		ctx.font = "10pt Arial"
		for(var i = 0; i < pawnArray.length; i++){
			var p = pawnArray[i];
			if(this.pawnIndex[p.xCoor][p.yCoor]!=0 && p.health>0){
				ctx.fillStyle = p.getColor();;
				ctx.fillText(p.character, p.xPosition, p.yPosition);
				this.pawnIndex[p.xCoor][p.yCoor] = p;
				this.stringArray[p.xCoor][p.yCoor] = p.character;
			}
		}
	};
	
	this.drawMap = function(){
		ctx.font = "12pt Arial";
		ctx.fillStyle = "white";
		var adjX = 0;
		var adjY = 0;
		for(var i = 0; i < cols; i++){
			for(var j = 0; j < rows; j++){  //loop thru pawns, check if any are suppose to be at current spot
											//else print a " . "
				for(var k = 0; k <charArray.length; k++){
					if(this.stringArray[i][j] == charArray[k]){
						adjX = charXadj[k];		
						adjY = charYadj[k];		
						ctx.fillStyle = charColors[k];
						break;
					}
				}
				if(this.pawnIndex[i][j] == 0){	
					ctx.fillText(this.stringArray[i][j], (i*16+2) + adjX, (j*16+10) + adjY );
					adjX = 0;
					adjY = 0;
					ctx.fillStyle = "white";
				}
			}
		}
	};

	this.buildStructure = function(element, startX, startY, direction, length){
		var xdir = 0;
		var ydir = 0;
		switch(direction){
			case "l": xdir = -1;  
				break;
			case "r": xdir = 1;
				break; 
			case "u": ydir = -1;
				break;
			case "d": ydir = 1;
				break;
		}
		for(var i = 0; i<length; i++){
			this.stringArray[startX + (xdir*i)][startY + (ydir*i)] = element;
		}
	}

	this.buildRoom = function(startX, startY, xSize, ySize){		
		for(var x = 0; x<xSize; x++){
			for(var y = 0; y<ySize; y++){
				if(x ==0 || y==0 || x ==xSize-1 || y == ySize-1){
					this.stringArray[x+startX][y+startY] = " # "; 
				}else{
					this.stringArray[x+startX][y+startY] = " . ";
				}
			}
		}
	};
};

var myMap = new map();
myMap.buildRoom(25, 19, 7, 6);
myMap.buildRoom(21, 3, 9, 10);
myMap.buildRoom(8, 2, 5, 7);
myMap.buildRoom(2, 17, 10, 5);
myMap.buildRoom(35, 4, 8, 5);
myMap.buildRoom(37, 0, 5, 3);

myMap.buildRoom(37, 21, 5, 4);

myMap.buildStructure(" . ", 2, 0, "d", 7);
myMap.buildStructure(" . ", 3, 0, "d", 7);

myMap.buildStructure(" . ", 5, 6, "d", 12);
myMap.buildStructure(" . ", 6, 6, "d", 12);

myMap.buildStructure(" . ", 6, 20, "r", 20);
myMap.buildStructure(" . ", 30, 23, "r", 10);

myMap.buildStructure(" . ", 2, 7, "r", 38);
myMap.buildStructure(" . ", 3, 6, "r", 38);

myMap.buildStructure(" . ", cols-4, rows-3, "u", 22);

myMap.buildStructure(" . ", 28, 10, "d", 10);


var charArray = [" + ", " # ", "~~ "];
var charXadj = [-2, -2, -4];
var charYadj = [4, 5, 4];
var charColors = ["white", "gray", "red"];    


var player1 = new pawn(" J ", 3, 0, -3, 4, "silver", "player");

var enemy1 = new pawn("[E]", 25, 8, -3, 4, "purple", "enemy");
var enemy2 = new pawn("[E]", 24, 6, -3, 4, "purple", "enemy");
var enemy3 = new pawn("[E]", 7, 19, -3, 4, "purple", "enemy");
var enemy4 = new pawn("[E]", 39, 6, -3, 4, "purple", "enemy");

var npc1 = new pawn(" [M]", 28, 21, -6, 4, "white", "npc");
var item1 = new pawn ("[?]", 10, 18, -2, 3, "white", "item");
var item2 = new pawn ("[?]", 10, 6, -2, 3, "white", "item");


var pawnArray = [player1, enemy1,enemy2, enemy3, enemy4, npc1, item1, item2];

setInterval(function(){
	//enemy1.attack("right");

}, 1000);


soundtrack.play();
setInterval(function(){
	soundtrack.stop();
	soundtrack.play();
}, 105000);


//console.log(player1.character[0]);
//player1.character = (player1.character).replaceAt(0, "!");
//console.log(player1.character[0]);
