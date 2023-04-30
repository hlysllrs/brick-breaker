/* 
PUZZLES TO SOLVE:
1. HTML canvas
2. create bricks, ball, and paddle using classes and methods
3. move paddle
4. move ball
5. collision detection
*/

// ------------------------------------------
// cached canvas element and context
// ------------------------------------------
const canvasEl = document.querySelector('#canvas')
const ctx = canvasEl.getContext('2d')


// ------------------------------------------
// variables
// ------------------------------------------
const canvasCenterX = canvasEl.width / 2


// ------------------------------------------
// cached DOM elements
// ------------------------------------------
const scoreEl = document.querySelector('#score')
const livesEls = document.querySelectorAll('#life')





// ------------------------------------------
// classes ---- do I need these???? 
// ------------------------------------------

class Brick {
    constructor(){
        this.width = width
        this.height = this.height
        this.x = x
        this.y = y
    }
}

class Paddle {
    constructor(width, height, x, y){
        this.width = width
        this.height = height
        this.x = x
        this.y = y
    }
}

class Ball {
    constructor(x, y, radius){
        this.x = x
        this.y = y
        this.radius = radius
        this.startangle = 0
        this.endAngle = Math.PI * 2
        this.antiClockwise = true
    }
}






// ------------------------------------------
// event listeners
// ------------------------------------------



// ------------------------------------------
// functions
// ------------------------------------------
function draw(){
    ctx.beginPath()
    ctx.arc(canvasCenterX, 675, 10, 0, Math.PI * 2, true)
    ctx.fillStyle = 'red'
    ctx.fill()
}

draw()

