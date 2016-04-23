// Force directed Abstract Syntax Tree Interpreter
// Copyright Charles Li

(function () {
/*******                Beginning                     ******/
    "use strict";
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

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
    var deltaDownVector = new Vector(0,50);

/*******                Data                     ******/
    var firstAtom = { // Root Node - very first atom
        type: "",
        text: "{}",
        mass: 50000,
        rad: 30,
        pos: new Vector(myCanvas.width/4, myCanvas.height/5),
        speed: new Vector(0, 0)
    };

    var currAtom = firstAtom; // for drawing


    var startingExpr = [];
    var currExpr = startingExpr;
    
    //startingExpr.push(newObj2withSub());

    // First way
    function newObj1(myName){  // function object  
        if (!(this instanceof newObj1)) { // dont need new
           return new newObj1("sNew");
        }
        
        this.type = "new_obj";
        this.text = myName || "obj";
        this.mass = 20;
        this.rad = 20;
        this.pos = currAtom.pos.add(deltaRightVector);
        this.speed = new Vector(0, 0);

        currAtom = this;
        return this;
    };

    // Second way
    function newObj2(myName){ // object literal
        var myAtom = {
            text : myName || "",
            mass : 20,
            rad : 20,
            pos : currAtom.pos.add(deltaRightVector),
            speed : new Vector(0, 0)
        }
        currAtom = myAtom;
        return myAtom;
    };

    function newObj2withSub(myName){ // object literal
        var localSubObj = newSubObj("");
        var myAtom = {
            text : myName || "",
            mass : 20,
            rad : 20,
            pos : currAtom.pos.add(deltaRightVector),
            subExpr : [localSubObj],
            speed : new Vector(0, 0),
        }

        localSubObj.parentAtom = myAtom;
        
//        myAtom.subExpr.push(localSubObj);
        currAtom = myAtom.subExpr[0];
        //currExpr = myAtom.subExpr; // wrong place
        return myAtom;
    };
    
    function newSubObj(myName){ // object literal
        var myAtom = {
            text : myName || "",
            mass : 20,
            rad : 20,
            pos : currAtom.pos.add(deltaDownVector),
            speed : new Vector(0, 0)
        }
        return myAtom;
    };
    



/*******                Interpreter                     ******/
    function interpret(myExpr) {
        console.log("interpret", myExpr);
        if(myExpr[0].subExpr) {
           console.log("has subexpr");
           interpret(myExpr[0].subExpr); 
        }
        if( myExpr.length >= 3 ) {
            console.log("length great or equal to 3");
            console.log(myExpr[0]);
            console.log(myExpr[0].text);
            if ( myExpr[0].text == "CDR" ) { // if 3 or more nodes exists, take out the second one
                console.log("CDR");
                myExpr.splice(0,2); // start at second and take out 2 nodes.
            }
        }

    }


/*******                Input                     ******/
    document.addEventListener("keydown", keyDownHandler, false);

    // Handle input
    function keyDownHandler(e) {
        switch(e.keyCode) {
            case 57:  // Open Parathesis
                currExpr.push( newObj2withSub("()"));
                console.log("currExpr        : ", currExpr);
                currExpr[currExpr.length-1].subExpr[0].parentExpr = currExpr; // give first child node the parent expr for curser movement
                currExpr = currExpr[currExpr.length-1].subExpr; //shift current list one level down
                break;
            case 219: // Open Bracket
                currExpr.push( newObj2withSub("[]"));
                console.log("currExpr        : ", currExpr);
                currExpr[currExpr.length-1].subExpr[0].parentExpr = currExpr; // give first child node the parent expr for curser movement
                currExpr = currExpr[currExpr.length-1].subExpr; //shift current list one level down
                //startingExpr[stringExpr.length].subExpr.push(newSubObj());
                break;
            case 48: // Close Parenthesis
            case 221: // Close bracket
                currExpr = currExpr[0].parentExpr; // return curser to parent Expr
                currAtom = currExpr[currExpr.length-1]; // atom defines draw cordnits
                break;
            case 39: // Right arrow
                break;
            case 37: // Left arrow
                break;
            case 8: // Backspace
                break;
            case 13: // Enter - Single step
                interpret(startingExpr); // always starts from the top
                break;
            case 32: // Space - New node unless cur node is empty
                if(e.shiftKey) {
                    currExpr.push( newObj1() ); // big
                } else {
                    currExpr.push( newObj2() );
                    console.log("currExpr        : ", currExpr);
                    console.log("currExpr.length : ", currExpr.length);
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
    
    
    


/*******                Graphics Lib                     ******/
    function drawText(myStr, posVector){
        ctx.font = "25px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(myStr, posVector.x-10, posVector.y+7);
    }

    // Draw a single Atom
    function drawNode(node) {
        //console.log("drawNode", node);

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
        //console.log("drawing this list", myList);
        //console.log("drawing this list length", myList.length);
        for(var i=0; i< myList.length; i++){
            drawNode(myList[i]);
            if (myList[i].subExpr && 
                myList[i].subExpr.constructor === Array &&
                myList[i].subExpr.length &&
                typeof myList[i].subExpr != 'undefined' ){
            //if (startingExpr[i].subExpr && startingExpr[i].subExpr instanceof Array){
                //alert(i);
                drawList(myList[i].subExpr);
                
            }
        }
    }

    // Main Loop
    function drawAll(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear screen
        drawList(startingExpr)
		requestAnimationFrame(drawAll);
    }

    //setInterval(drawAll, 16);  // run faster for debugging
    document.addEventListener('DOMContentLoaded', drawAll, false); // start when ready
    
})   ();
