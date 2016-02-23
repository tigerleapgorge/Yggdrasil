// Force directed Abstract Syntax Tree Interpreter
// Copyright Charles Li

(function () {
/*******                Beginning                     ******/
    "use strict";
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

/*******                Data                     ******/
    var firstAtom = {
        type: "",
        text: "F",
        mass: 50000,
        rad: 30,
        pos: new Vector(myCanvas.width/4, myCanvas.height/5),
        speed: new Vector(0, 0)
    };

    var currAtom = firstAtom;
    
    // First way
    function newObj(){  // function object  
        if (!(this instanceof newObj)) { // dont need new
           return new newObj();
        }
        
        this.type = "new_obj";
        this.text = "obj";
        this.mass = 20;
        this.rad = 20;
        this.pos = currAtom.pos.add(deltaRightVector);
        this.speed = new Vector(0, 0);

        currAtom = this;
        return this;
    };

    // Second way
    function appendAtom(){ // object literal
        var myAtom = {
            text : "lit",
            mass : 20,
            rad : 20,
            pos : currAtom.pos.add(deltaRightVector),
            speed : new Vector(0, 0)
        }

        currAtom = myAtom;
        return myAtom;
    };

    var startingExpr = [];
    startingExpr.push(firstAtom);


/*******                Interpreter                     ******/
    function interpret(ND_list) {
        if( ND_list.length >= 3 &&
            ND_list[0].text ) { // if 3 or more nodes exists, take out the second one
            
            ND_list.splice(1,1); // start at second and take out 1 node.
        }

    }


/*******                Input                     ******/
    document.addEventListener("keydown", keyDownHandler, false);

    // Handle input
    function keyDownHandler(e) {
        switch(e.keyCode) {
            case 39: // Right arrow
                break;
            case 37: // Left arrow
                break;
            case 8: // Backspace
                break;
            case 13: // Enter - Single step
                    interpret(startingExpr);
                break;
            case 32: // Space - New node unless cur node is empty
                if(e.shiftKey) {
                    startingExpr.push( newObj()); // big
                } else {
                    startingExpr.push( appendAtom() );
                }
                break;
            case 112: // F1 - help page
                break;
            default:
                if(e.keyCode >= 48 && e.keyCode <= 57) { // 0 - 9
                    currAtom.text = currAtom.text.concat( String.fromCharCode(e.keyCode) );
                } else if(e.keyCode >= 65 && e.keyCode <= 90) { // a - z
                    currAtom.text = currAtom.text.concat( String.fromCharCode(e.keyCode) );
                } else {
                    console.log("Unknown keycode", e.keyCode);
                }
                break;
        }
    }
    
    
    
/*******                Vector Lib                     ******/
    function Vector(x, y) {
        if ( !(this instanceof Vector) ) { // dont need new
           var new_vec = new Vector(x, y);
           return new_vec;
        }
        this.x = x || 0;
        this.y = y || 0;
    };

	Vector.prototype.add = function(vecArg) {
        return new Vector(this.x + vecArg.x, this.y + vecArg.y);
	};

    var deltaRightVector = new Vector(50,0);
    var deltaDownVector = new Vector(0,20);

/*******                Graphics Lib                     ******/
    function drawText(myStr, posVector){
        ctx.font = "25px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(myStr, posVector.x-10, posVector.y+7);
    }

    // Draw a single Atom
    function drawNode(node) {
        console.log("drawNode", node);

        // Draw a circle
        ctx.beginPath();
        ctx.arc(node.pos.x, node.pos.y, node.rad, 0, Math.PI*2);
        ctx.fillStyle = "rgb(255, 249, 107)";
        ctx.fill();
        ctx.closePath();

        // If text exists draw text
        if (node.text){
            drawText(node.text, node.pos)
        }
    }

    // Draw a list of Nodes
    function drawList(myList){
        for(var i=0; i< myList.length; i++){
            drawNode(startingExpr[i]);
        }
    }

    // Main Loop
    function drawAll(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawList(startingExpr)
		requestAnimationFrame(drawAll);
    }

    //setInterval(drawAll, 16);  // run faster for debugging
    document.addEventListener('DOMContentLoaded', drawAll, false); // start when ready
    
})   ();
