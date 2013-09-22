var canvasH = 395;
var canvasW = 630;


// grabs canvas by ID from index.html
var canvas = document.getElementById('screen');

//getContext makes context object that is filled with functions for drawing
var ctx = canvas.getContext('2d');

$(document).ready(function(e){
	$(window).keypress(function(event){
		//console.log(event.which);
		if(event.which == 97) player1.move("left");
		if(event.which == 100) player1.move("right");
		if(event.which == 119) player1.move("up");
		if(event.which == 115) player1.move("down");
	});
});

var rows = 23;
var cols = 37;

String.prototype.replaceAt=function(index, character){
	return this.substr(0, index) + character + this.substr(index+character.length);
}

function pawn(character, xCoor, yCoor, xAdj, yAdj, color){
	
	this.character = character;
	this.xCoor = xCoor;
	this.yCoor = yCoor;
	this.xAdj = xAdj;
	this.yAdj = yAdj;
	this.color = color;
	//underlying character
	this.underChar = myMap.stringArray[xCoor][yCoor];
	
	myMap.stringArray[xCoor][yCoor] = this.character;

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
		
		//this.underChar = myMap.stringArray[xCoor+xdirrri][yCoor+ydir];
		
		//if move happens
		

		if(myMap.stringArray[this.xCoor+xdir][this.yCoor+ydir] == " . "){
			myMap.isPawn[this.xCoor][this.yCoor] = false;
			myMap.isPawn[this.xCoor+xdir][this.yCoor+ydir] = true;
			
			myMap.stringArray[this.xCoor][this.yCoor] = this.underChar;
			myMap.isPawn[this.xCoor][this.yCoor]=false;	
			//update position
			
			this.xCoor = this.xCoor + xdir;
			this.yCoor = this.yCoor + ydir;
			

			this.underChar = myMap.stringArray[this.xCoor][this.yCoor];
			//myMap.stringArray[this.xCoor][this.yCoor] = this.character;	
			this.refreshPosition();	
		}
	}

	this.refreshPosition = function(){
		this.xPosition = this.xCoor*16+2+this.xAdj;
		this.yPosition = this.yCoor*16+10+this.yAdj;	
	}
	this.refreshPosition();

};

function map(){
	
	//indexes of arrays
	this.xIndex = 0;
	this.yIndex = 0;
	//coordinates on canvas
	this.x = 2;
	this.y = 10;

	this.stringArray = new Array(rows);
	for(var i = 0; i < cols; i++){
		this.stringArray[i] = new Array(rows);
		for(var j = 0; j < rows; j++){
			this.stringArray[i][j] = "   ";
		}
	}

	this.isPawn = new Array(rows);
	for(var i = 0; i < cols; i++){
		this.isPawn[i] = new Array(rows);
		for(var j = 0; j < rows; j++){
			this.isPawn[i][j] = false;
		}
	}
	
	this.drawPawns = function(){
		ctx.font = "11pt Arial"
		for(var i = 0; i < pawnArray.length; i++){
			var p = pawnArray[i];
			ctx.fillStyle = p.color;
			p.underChar = myMap.stringArray[p.xCoor][p.yCoor];
			//console.log(p.underChar);
			ctx.fillText(p.character, p.xPosition, p.yPosition);
			myMap.isPawn[p.xCoor][p.yCoor] = true;
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
				
				if(!this.isPawn[i][j]){	
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
var charArray = [" + ", " # ", "\\Q/", "[B]"];
var charXadj = [-2, 0, -3, 4];
var charYadj = [4, 5, -3, 4];


var myMap = new map();
var player1 = new pawn("\\Q/", 20, 10, -3, 4, "black");
var player2 = new pawn("[B]", 17, 8, -3, 4, "red");
var player3 = new pawn(" [X]", cols-1, rows-1, -6, 4, "white");
var pawnArray = [player1, player2,player3];

myMap.buildRoom(21, 15, 11, 6);
myMap.buildRoom(16, 5, 5, 8);

myMap.buildStructure(" . ", 24, 9, "l", 5);
myMap.buildStructure(" . ", 24, 10, "l", 5);
myMap.buildStructure(" . ", 24, 15, "u", 5);
myMap.buildStructure(" . ", 25, 15, "u", 7);

//console.log(player1.character[0]);
//player1.character = (player1.character).replaceAt(0, "!");
//console.log(player1.character[0]);
