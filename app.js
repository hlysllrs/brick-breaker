/* 
PUZZLES TO SOLVE:
- center bricks
- move ball
    - fine tune movement directions?
    - ball accelerated when spacebar is pushed again??
- collision detection
    - collisions with side of paddle
    - collisions with bricks 
        - sides and bottom??
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
// define ball layout
const ball = {
    x: canvasEl.width / 2,
    y: canvasEl.height -31,
    radius: 7,
    vx: -1,
    vy: -2
}

// define paddle layout
const paddle = {
    x: canvasEl.width / 2 - (canvasEl.width / 10 / 2),
    y: canvasEl.height - 20,
    width: canvasEl.width / 10,
    height: 10,
    vxl: 0,
    vxr: 0
}

// define brick layout
const brickLayout = {
    x: canvasEl.width * .05, 
    y: canvasEl.height * .05, 
    width: canvasEl.width * .04472,
    height: canvasEl.height * .04111,
    xOffset: canvasEl.width * .005, 
    yOffset: canvasEl.height * .01,
    rows: 9,
    columns: 18, 
    colors:['#e92e3d', '#ff9300','#ffcf02', '#00993c', '#5eb99b', '#028fe1', '#0052bc', '#995cc7', '#e64388']
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
    if(e.code === 'ArrowLeft' && paddle.x >= 0) paddle.vxl = -7
    if(e.code === 'ArrowRight' && paddle.x + paddle.width <= canvasEl.width) paddle.vxr = 7
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
function start() {
    setCanvasSize()
    addBricksToArr()
    drawBall()
    drawPaddle()
    drawBricks()
}


function resetScreen() {
    setCanvasSize()
    drawBall()
    drawPaddle()
    drawBricks()
}

function setCanvasSize() {
    canvasEl.width = canvasEl.clientWidth
    canvasEl.height = canvasEl.width / 2
}

// create brick layout
function addBricksToArr() {
    for(i = 0; i < brickLayout.rows; i++) {
        const brickRow = []
        for(j = 0; j < brickLayout.columns; j++) {
            const brick = {
                x: brickLayout.x,
                y: brickLayout.y,
                width: brickLayout.width,
                height: brickLayout.height,
                color: brickLayout.colors[i]
            }
            brickRow.push(brick)
            brickLayout.x += brickLayout.width + brickLayout.xOffset

        }
        bricksArr.push(brickRow)
        brickLayout.y += brickLayout.height + brickLayout.yOffset
        brickLayout.x = canvasEl.width * .05
    }
}

function drawPaddle() {
    ctx.fillStyle = 'blue'
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true)
    ctx.fillStyle = 'red'
    ctx.fill()
}

function drawBricks() {
    bricksArr.forEach((row) => {
        row.forEach((brick) => {
            ctx.fillStyle = brick.color
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
        })
    })
}


function animate() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    animateBall()
    animatePaddle()
    animateBricks()

    // check if ball is within canvas area
    if(ball.y - ball.radius > canvasEl.height) {
        ball.x = canvasEl.width / 2,
        ball.y = canvasEl.height -30,
        paddle.x = canvasEl.width / 2 - (canvasEl.width / 10 / 2),
        paddle.y = canvasEl.height - 20,
        resetScreen()
    } else {
        requestAnimationFrame(animate)
    }
}

function animateBall() {
    drawBall()

    // change position
    ball.x += ball.vx
    ball.y += ball.vy

    // detect side walls
    if(ball.x + ball.radius >= canvasEl.width || ball.x - ball.radius <= 0) {
        ball.vx *= -1
    }

    // detect top wall and paddle
    if(ball.y - ball.radius < 0) {
        ball.vy *= -1
    }

    // detect top of paddle
    if (ball.x + ball.radius > paddle.x && 
            ball.x - ball.radius < paddle.x + paddle.width && 
            ball.y + ball.radius > paddle.y && 
            ball.y - ball.radius < paddle.y + paddle.height) {
                ball.vy *= -1
    }

    // detect sides of paddle
    // if () {
        
    // }
}

function animatePaddle() {
    drawPaddle()

    // update paddle position
    paddle.x += paddle.vxr
    paddle.x += paddle.vxl

    if(paddle.x <= 0){
        paddle.vxl = 0
    }

    if(paddle.x + paddle.width >= canvasEl.width){
        paddle.vxr = 0
    }
}

function animateBricks() {
    drawBricks()

    bricksArr.forEach((row) => {
        row.forEach((brick, i) => {
            // detect top of bricks
            if (ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height * .2) {
                    ball.vy *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(i, 1)
                    console.log('hit top')
            // detect bottom of bricks
            } else if(ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y - ball.radius >= brick.y + brick.height * .8 &&
                ball.y + ball.radius <= brick.y + brick.height) {
                    ball.vy *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(i, 1)
                    console.log('hit bottom')
            }
            // detect left side of bricks
            if (ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width * .2 &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vx *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(i, 1)
                    console.log('hit left')
            // detect right side of bricks
            } else if (ball.x - ball.radius >= brick.x + brick.width * .8 && 
                ball.x + ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vx *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(i, 1)
                    console.log('hit right')
            }
        })
    })
}


start()




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