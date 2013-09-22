var canvasH = 395;
var canvasW = 630;

var soundtrack = AudioFX('sounds/spooky.ogg',{loop: true}); //ogg sound files supported in firefox

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

var rows = 23;
var cols = 37;

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
		var xdir = 0;
		var ydir = 0;
		switch(direction){
			case "left": 
				if(this.xCoor !=0) xdir=-1;
				break;
			case "right": 
				if(this.xCoor !=36) xdir=1;
				break;
			case "up": 
				if(this.yCoor != 0) ydir=-1;
				break;
			case "down": 
				if(this.yCoor !=22) ydir=1;
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
					ctx.fillText(" v ", this.xPosition,this.yPosition + 16);
					break;
			}
			this.canAttack = false;
			setTimeout(function(){
				player1.canAttack = true;
				//console.log("readytoattack " + player1.canAttack);
			},  500);
		}else{
			//console.log("cooling down");
		}
		var target = myMap.pawnIndex[this.xCoor+xdir][this.yCoor+ydir];
		//if you hit an enemy
		if(target!=0 && (xdir !=0 || ydir!=0)){
			console.log("hit!");
			target.health--;
			if(target.health == 0){
				myMap.stringArray[target.xCoor][target.yCoor] = target.underChar;
				myMap.pawnIndex[target.xCoor][target.yCoor] = 0;
				console.log("dead");
			}
		}else if(this.canAttack){
			console.log("miss");	
		}
	};
};

function map(){
	
	//coordinates on canvas
	//this.x = 2;
	//this.y = 10;

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
						break;
					}
				}
				if(this.pawnIndex[i][j] == 0){	
					ctx.fillText(this.stringArray[i][j], (i*16+2) + adjX, (j*16+10) + adjY );
					adjX = 0;
					adjY = 0;
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
myMap.buildRoom(21, 15, 11, 6);
myMap.buildRoom(16, 5, 5, 8);
myMap.buildRoom(8, 2, 5, 10);

myMap.buildStructure(" . ", 24, 9, "l", 16);
myMap.buildStructure(" . ", 24, 10, "l", 16);
myMap.buildStructure(" . ", 24, 15, "u", 5);
myMap.buildStructure(" . ", 25, 15, "u", 7);


var charArray = [" + ", " # "];
var charXadj = [-2, 0, -3, 4];
var charYadj = [4, 5, -3, 4];
var charColors = {};    


var player1 = new pawn("\\Q/", 20, 10, -3, 4, "black", "player");
var player2 = new pawn("[B]", 17, 8, -3, 4, "blue", "enemy");
var player3 = new pawn(" [X]", cols-1, rows-1, -6, 4, "npc");
var pawnArray = [player1, player2, player3];


//soundtrack.play();

//console.log(player1.character[0]);
//player1.character = (player1.character).replaceAt(0, "!");
//console.log(player1.character[0]);
