/* 
PUZZLES TO SOLVE:
- create bricks
- stop paddle from moving beyond canvas area
- move ball
    - fine tune movement directions?
- collision detection
    - collisions with side of paddle
    - collisions with bricks
*/

/*-----------------------------------------
canvas element
------------------------------------------*/
const canvasEl = document.querySelector('#canvas')
const ctx = canvasEl.getContext('2d')


canvasEl.width = canvasEl.clientWidth
canvasEl.height = canvasEl.width / 2



/*-----------------------------------------
variables
------------------------------------------*/
const ball = {
    x: canvasEl.width / 2,
    y: canvasEl.height -30,
    radius: 10,
    dx: -3,
    dy: -4
}

const paddle = {
    x: canvasEl.width / 2 - (canvasEl.width / 10 / 2),
    y: canvasEl.height - 20,
    width: canvasEl.width / 10,
    height: 10,
    vxl: 0,
    vxr: 0
}

const brick = {
    x: 5, 
    y: 5, 
    width: 10,
    height: 5
}

const bricksArr = []


/*-----------------------------------------
cached DOM elements
------------------------------------------*/
const scoreEl = document.querySelector('#score')
const livesEls = document.querySelectorAll('#life')


/*-----------------------------------------
event listeners
------------------------------------------*/
// scale canvas and elements when window is resized
window.addEventListener('resize', () => {
    // clear canvas
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    // redraw canvas and elements
    setCanvasSize()
    drawPaddle()
    drawBall()
})

// move paddle when arrow keys are pressed
document.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowLeft') paddle.vxl = -5
    if(e.code === 'ArrowRight') paddle.vxr = 5
})

// stop paddle when arrow keys are released
document.addEventListener('keyup', (e) => {
    if(e.code == 'ArrowLeft') paddle.vxl = 0
    if(e.code == 'ArrowRight') paddle.vxr = 0
})

// launch ball and allow animation when spacebar is pressed
document.addEventListener('keydown', (e) => {
    if(e.code == 'Space') {
        animate()
    }
})

/*-----------------------------------------
functions
------------------------------------------*/
function init() {
    setCanvasSize()
    drawBall()
    drawPaddle()
}

function setCanvasSize() {
    canvasEl.width = canvasEl.clientWidth
    canvasEl.height = canvasEl.width / 2
}

function drawPaddle() {
    const minCanvasDim = Math.min(canvasEl.height, canvasEl.width)
    ctx.fillStyle = 'blue'
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

function drawBall() {
    const minCanvasDim = Math.min(canvasEl.height, canvasEl.width)
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true)
    ctx.fillStyle = 'red'
    ctx.fill()
}


function animate() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    drawBall()
    drawPaddle()


    // change position
    ball.x += ball.dx
    ball.y += ball.dy

    // detect side walls
    if(ball.x + ball.radius >= canvasEl.width || ball.x - ball.radius <= 0) {
        ball.dx *= -1
    }

    // detect top wall and paddle
    if(ball.y - ball.radius < 0 || 
        (ball.x + ball.radius > paddle.x && 
            ball.x - ball.radius < paddle.x + paddle.width && 
            ball.y + ball.radius > paddle.y && 
            ball.y - ball.radius < paddle.y + paddle.height)) {
        ball.dy *= -1
    }

    // update paddle position
    paddle.x += paddle.vxr
    paddle.x += paddle.vxl

    if(ball.y - ball.radius > canvasEl.height) {
        ball.x = canvasEl.width / 2,
        ball.y = canvasEl.height -30,
        paddle.x = canvasEl.width / 2 - (canvasEl.width / 10 / 2),
        paddle.y = canvasEl.height - 20,
        init()
    } else {
        requestAnimationFrame(animate)
    }
}

// function animatePaddle() {
//     ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
//     paddle.x += paddle.vxr
//     paddle.x += paddle.vxl
//     drawPaddle()
//     requestAnimationFrame(animatePaddle)
// }


init()




/*
------------------------------------------
resources used:
------------------------------------------
HTML canvas basics: 
    https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
    https://www.w3schools.com/graphics/canvas_intro.asp
    
making HTML canvas dynamic to browser window size: 
    https://isaiahnixon.com/dynamic-canvas/

HTML canvas movement controls: 
    https://www.youtube.com/watch?v=kX18GQurDQg




*/