/* 
PUZZLES TO SOLVE:
- move ball
    - fine tune movement directions?
    - ball accelerated when spacebar is pushed again??
- collision detection
    - collisions with side of paddle
    - collisions with bricks 
        - sides and bottom??
- sound doesn't play for every brick hit --> need shorter sound clip??
- lives
- game over
- 1 or 2 players
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
let score = 0
const lives = [1, 1, 1]

let sound = 'on'


// define ball layout
const ball = {
    x: canvasEl.width / 2,
    y: canvasEl.height -31,
    radius: 7,
    vx: -2,
    vy: -4
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
    x: canvasEl.width * .055, 
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


const brickSound = new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_008_17644.mp3')
brickSound.volume = .1
const hitSound = new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_006_17642.mp3')
hitSound.volume = .1
const gameOverSound = new Audio ('sounds/game-over-arcade-6435.mp3')
gameOverSound.volume = .1

/*-----------------------------------------
cached DOM elements
------------------------------------------*/
const scoreEl = document.querySelector('#score')
const livesEls = document.querySelectorAll('#life')
const modal = document.querySelector('#intro-modal')
const startBtn = document.querySelector('.start-button')



/*-----------------------------------------
event listeners
------------------------------------------*/
// listen for begin button click
startBtn.addEventListener('click', closeModal)

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
    if(e.code == 'Space' && modal.style.display === 'none') {
        animate()
    }
})

/*-----------------------------------------
functions
------------------------------------------*/
function init() {
    setCanvasSize()
    addBricksToArr()
    drawBricks()
    drawBall()
    drawPaddle()
}

// close button
function closeModal() {
    modal.style.display = 'none'
}

// reset screen after ball is missed
function resetScreen() {
    setCanvasSize()
    drawBall()
    drawPaddle()
    drawBricks()
}

// get canvas size
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
        brickLayout.x = canvasEl.width * .055
    }
}

// draw the paddle in canvas
function drawPaddle() {
    ctx.fillStyle = '#000000'
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

// draw the ball in canvas
function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true)
    ctx.fillStyle = '#000000'
    ctx.fill()
}

// draw bricksin canvas
function drawBricks() {
    bricksArr.forEach((row) => {
        row.forEach((brick) => {
            ctx.fillStyle = brick.color
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
        })
    })
}

// animate canvas
function animate() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    animateBall()
    animatePaddle()
    animateBricks()

    scoreEl.innerHTML = `score: ${score}`

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
        hitSound.play()
    }

    // detect top wall and paddle
    if(ball.y - ball.radius < 0) {
        ball.vy *= -1
        hitSound.play()
    }

    // detect top of paddle
    if (ball.x + ball.radius > paddle.x && 
        ball.x - ball.radius < paddle.x + paddle.width && 
        ball.y + ball.radius > paddle.y && 
        ball.y - ball.radius < paddle.y + paddle.height) {
            ball.vy *= -1
            hitSound.play()
    // detect left side of paddle
    } else if (ball.x + ball.radius >= paddle.x && 
        ball.x - ball.radius <= paddle.x + paddle.width * .01 &&
        ball.y + ball.radius >= paddle.y && 
        ball.y - ball.radius <= paddle.y + paddle.height) {
            ball.vx *= -1
            hitSound.play()
    // detect right side of paddle
    } else if (ball.x + ball.radius >= paddle.x && 
        ball.x - ball.radius <= paddle.x + paddle.width * .99 &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height) {
            ball.vx *= -1
            hitSound.play()
    } 
}

function animatePaddle() {
    drawPaddle()

    // update paddle position
    paddle.x += paddle.vxr
    paddle.x += paddle.vxl

    if(paddle.x <= 0){
        paddle.vxl = 0
    }
    // prevent paddle from leaving game area
    if(paddle.x + paddle.width >= canvasEl.width){
        paddle.vxr = 0
    }
}

function animateBricks() {
    drawBricks()

    bricksArr.forEach((row, i) => {
        row.forEach((brick, j) => {
            // detect top of bricks
            if (ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height * .01) {
                    ball.vy *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)
                    score += 100
                    brickSound.pause()
                    brickSound.play()
                    console.log('hit top')
            // detect bottom of bricks
            } else if(ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y + brick.height * .99 &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vy *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)   
                    score += 100
                    brickSound.pause()
                    brickSound.play()
                    console.log('hit bottom')
            // detect left side of bricks
            } else if (ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width * .01 &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vx *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)
                    score += 100
                    brickSound.pause()
                    brickSound.play()
                    console.log('hit left')
            // detect right side of bricks
            } else if (ball.x + ball.radius >= brick.x + brick.width * .99 && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vx *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)
                    score += 100
                    brickSound.pause()
                    brickSound.play()
                    console.log('hit right')
            }
        })
    })
}

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

sounds:
https://pixabay.com/sound-effects/search/game/



*/