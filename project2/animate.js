var canvasH = 395;
var canvasW = 630;

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

$(document).ready(function(e){
	$(window).keypress(function(event){
		console.log(event.which);
	});
});

var rows = 25;
var cols = 40;


function pawn(character, row, column, xAdj, yAdj, color){
	
	this.character = character;
	this.row = row;
	this.column = column;
	this.xAdj = xAdj;
	this.yAdj = yAdj;
	this.color = color;



}
/*
function drawMap(){

	var xIndex = 0;
	var yIndex = 0;
	var x = 0;
	var y = 0;
	
}
*/

function map(){
	
	//indexes of arrays
	this.xIndex = 0;
	this.yIndex = 0;
	//coordinates on canvas
	this.x = 2;
	this.y = 10;
	//this.x = this.xIndex*16 + 2;
	//this.y = this.yIndex*16 + 10;
	
	this.stringArray = new Array(rows);
	for(var i = 0; i < rows; i++){
		this.stringArray[i] = new Array(cols);
		for(var j = 0; j < cols; j++){
			this.stringArray[i][j] = " . ";
		}
	}

	this.drawMap = function(){
		ctx.font = "12pt Arial";
		ctx.fillStyle = "white";
		for(var i = 0; i < rows; i++){
			for(var j = 0; j < cols; j++){  //loop thru pawns, check if any are suppose to be at current spot
											//else print a " . "
				ctx.fillText(this.stringArray[i][j], (j*16+2), (i*16+10));
			}
		}
	};


	/*	
	ctx.font = "12pt Arial";
	ctx.fillStyle = "white";
	for(var x = 2; x<canvasW; x=x+16){
		for(var y = 10; y<canvasH; y=y+16){
			if(x == 34 && y == 26){
				ctx.fillText("[A]", x-3, y+4);
			}else if(x == 50 && y == 10){
				ctx.fillText("[A]", x-3, y+4);
				
			}else{
				ctx.fillText(" . ", x, y);
			}
			if(x==2){
			}
		}
	}
	*/

	//console.log("rows: "+rows);
	//console.log("cols: "+cols);
}

var myMap = new map();

setInterval(function(){
    //clears whole screen before objects are redrawn
    ctx.clearRect(0, 0, canvasW, canvasH);
	myMap.drawMap();
	myMap.stringArray[2][3] = "[A]";
}, 100);
