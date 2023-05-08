/* 
PUZZLES TO SOLVE:
- move ball
    - fine tune movement directions?
    - ball accelerated when spacebar is pushed again??
- collision detection --> maybe use switch cases??? 
    - collisions with side of paddle
    - collisions with bricks 
        - sides and bottom??
- sound doesn't play for every brick hit --> need shorter sound clip??
- center paddle for each difficulty
- game over
- wins
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

let numOfPlayers = 1
let currentPlayer = 1

// const players = {
//     1: {
//         playerName: 'player one',
//         score: 0,
//         lives: [1, 1, 1],
//         bricks: []
//     }, 
//     '-1': {
//         playerName: 'player two',
//         score: 0,
//         lives: [1, 1, 1],
//         bricks: []
//     }
// }

let currentDifficulty = 'hard'

const difficulties = {
    easy: {
        ballRadius: canvasEl.height / 60, 
        ballVX: 1, 
        ballVY: 3, 
        paddleWidth: canvasEl.width / 10,
        paddleSpeed: 5
    }, 
    medium: {
        ballRadius: canvasEl.height / 70, 
        ballVX: 2, 
        ballVY: 4, 
        paddleWidth: canvasEl.width / 12, 
        paddleSpeed: 7
    }, 
    hard: {
        ballRadius: canvasEl.height / 80, 
        ballVX: 3, 
        ballVY: 5, 
        paddleWidth: canvasEl.width / 15, 
        paddleSpeed: 9
    }
}

const sound = {
    status: 'on',
    volumeLevel: 0.1
}

// define ball layout
const ball = {
    y: canvasEl.height - 31,
    x: canvasEl.width / 2,
    radius: canvasEl.height / 50,
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

// array to store brick positions and colors
const bricksArr = []


const brickSound = new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_008_17644.mp3')
brickSound.volume = sound.volumeLevel
const hitSound = new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_006_17642.mp3')
hitSound.volume = sound.volumeLevel
const gameOverSound = new Audio ('sounds/game-over-arcade-6435.mp3')
gameOverSound.volume = sound.volumeLevel

/*-----------------------------------------
cached DOM elements
------------------------------------------*/
const scoreEl = document.querySelector('#score')
const lifeEls = document.querySelectorAll('.life')
const introModal = document.querySelector('#intro-modal')
const startBtn = document.querySelector('.start-button')
const menu = document.querySelector('.menu')
const menuBtn = document.querySelector('#menu-button')
const closeBtn = document.querySelector('#close-button')
const diffBtnCont = document.querySelector('#diff-button-container')
const diffBtns = document.querySelectorAll('.diff-button')
const playerBtnCont = document.querySelector('#player-button-container')
const playerBtns = document.querySelectorAll('.player-button')
const soundBtnCont = document.querySelector('#sound-button-container')
const soundBtns = document.querySelectorAll('.sound-button')
const volSlider = document.querySelector('#volume')
const gameOverModal = document.querySelector('#game-over-modal')
const restartBtn = document.querySelector('.restart-button')

/*-----------------------------------------
event listeners
------------------------------------------*/
// listen for begin button click (on intro modal)
startBtn.addEventListener('click', toggleIntroModal)

// listen for restart button click (on game over modal)
restartBtn.addEventListener('click', restartGame)

// listen for menu button click
menuBtn.addEventListener('click', toggleMenu)

// listen for menu close button click
closeBtn.addEventListener('click', toggleMenu)

// listen for difficulty buttons
diffBtnCont.addEventListener('click', (e) => {
    // ensure click was on a button
    if (e.target.nodeName !== 'BUTTON') return
    
    // change current difficulty to selected button
    currentDifficulty = e.target.id

    // update selections in options menu
    setMenuSelections()

    // render game with new difficulty
    clearCanvas()
    setDifficulty()
    resetScreen()
})

// listen for player num buttons
playerBtnCont.addEventListener('click', (e) => {
    // ensure click was on a button
    if (e.target.nodeName !== 'BUTTON') return

    // change number of players to selected button
    const val = e.target.id.replace(/players-/, '')
    numOfPlayers = val

    // update selections in options menu
    setMenuSelections()
})

// listen for sound buttons
soundBtnCont.addEventListener('click', (e) => {
    // ensure click was on a button
    if (e.target.nodeName !== 'BUTTON') return

    // change sound status to selected button
    const val = e.target.id.replace(/sound-/, '')
    sound.status = val

    // update selections in options menu
    setMenuSelections()
})

// move paddle when arrow keys are pressed
document.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowLeft' && paddle.x >= 0) paddle.vxl = difficulties[currentDifficulty].paddleSpeed * -1
    if(e.code === 'ArrowRight' && paddle.x + paddle.width <= canvasEl.width) paddle.vxr = difficulties[currentDifficulty].paddleSpeed
})

// stop paddle when arrow keys are released
document.addEventListener('keyup', (e) => {
    if(e.code == 'ArrowLeft') paddle.vxl = 0
    if(e.code == 'ArrowRight') paddle.vxr = 0
})

// launch ball and allow animation when spacebar is pressed
document.addEventListener('keydown', (e) => {
    if(e.code == 'Space' && introModal.style.display === 'none') {
        animate()
    }
})

/*-----------------------------------------
functions
------------------------------------------*/
function init() {
    setCanvasSize()
    addBricksToArr()
    setDifficulty()
    displayLives()
    displayScore()
    drawBricks()
    drawBall()
    drawPaddle()
}

// close modal changing display to 'none'
function toggleIntroModal() {
    if(introModal.style.display === 'none') {
        introModal.style.display = 'block'
    } else {
        introModal.style.display = 'none'
    }

}

// open / close menu
function toggleMenu() {
    setMenuSelections()
    if(menu.style.display === 'none') {
        menu.style.display = 'block'
    } else {
    menu.style.display = 'none'
    }
} 

// show current game options in menu
function setMenuSelections() {
    diffBtns.forEach((btn) =>{
        if (btn.id == currentDifficulty) {
            btn.style.color = '#f4f4f4'
            btn.style.backgroundColor = '#000000'
        } else {
            btn.style.color = '#000000'
            btn.style.backgroundColor = '#f4f4f4'
        }
    })

    playerBtns.forEach((btn) =>{
        const val = btn.id.replace(/players-/, '')
        if (val == numOfPlayers) {
            btn.style.color = '#f4f4f4'
            btn.style.backgroundColor = '#000000'
        } else {
            btn.style.color = '#000000'
            btn.style.backgroundColor = '#f4f4f4'
        }
    })

    soundBtns.forEach((btn) =>{
        const val = btn.id.replace(/sound-/, '')
        if (val == sound.status) {
            btn.style.color = '#f4f4f4'
            btn.style.backgroundColor = '#000000'
        } else {
            btn.style.color = '#000000'
            btn.style.backgroundColor = '#f4f4f4'
        }
    })
}

function setDifficulty() {
    ball.radius = difficulties[currentDifficulty].ballRadius
    ball.vx = difficulties[currentDifficulty].ballVX
    ball.vy = difficulties[currentDifficulty].ballVY
    paddle.width = difficulties[currentDifficulty].paddleWidth
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

// clear all elements on canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
}

// create brick layout
function addBricksToArr() {
    // for (let player in players) {
    //     for(i = 0; i < brickLayout.rows; i++) {
    //         const brickRow = []
    //         for(j = 0; j < brickLayout.columns; j++) {
    //             const brick = {
    //                 x: brickLayout.x,
    //                 y: brickLayout.y,
    //                 width: brickLayout.width,
    //                 height: brickLayout.height,
    //                 color: brickLayout.colors[i]
    //             }
    //             brickRow.push(brick)
    //             brickLayout.x += brickLayout.width + brickLayout.xOffset
    
    //         }
    //         player.bricks.push(brickRow)
    //         brickLayout.y += brickLayout.height + brickLayout.yOffset
    //         brickLayout.x = canvasEl.width * .055
    //     }
    // }

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
    clearCanvas()
    animateBall()
    animatePaddle()
    animateBricks()
    
    displayScore()

    // check if ball is within canvas area
    if(ball.y - ball.radius > canvasEl.height) {
        ball.x = canvasEl.width / 2,
        ball.y = canvasEl.height -30,
        paddle.x = canvasEl.width / 2 - (canvasEl.width / 10 / 2),
        paddle.y = canvasEl.height - 20,
        loseLife()
        resetScreen()
    } else if(winner || gameOverModal.style.display === 'block') {
        return
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

function loseLife() {
    // check for first 1 (usable life) in lives array
    const lifeIdx = lives.indexOf(1)

    console.log(lifeIdx)
    // if no usable lives present, game over
    if(lifeIdx === -1) {
        gameOver()
    } else {
        // change life value to 0
        lives[lifeIdx] = 0

         // update lives on DOM
        displayLives()
    }

    console.log(lives)

    // change players
    // currentPlayer *= -1
}

// show game over modal
function gameOver() {
    gameOverModal.style.display = 'block'
}

// update lives on screen
function displayLives() {
    lives.forEach((life, i) => {
        switch (life) {
            case 0: 
                lifeEls[i].style.backgroundColor = '#f4f4f4'
                break
            case 1: 
                lifeEls[i].style.backgroundColor = '#000000'
                break
        }
    })
}

// update score on screen
function displayScore() {
    scoreEl.innerHTML = `score: ${score}`
}

function restartGame() {
    // hide game over modal
    gameOverModal.style.display = 'none'

    // remove all remaining bricks from bricks array
    bricksArr.forEach((brick) => {
        bricksArr.pop()
    })

    // reset brick layout start positions
    brickLayout.x = canvasEl.width * .055, 
    brickLayout.y = canvasEl.height * .05, 

    // reset score and lives
    score = 0
    lives.splice(0, 3, 1, 1, 1)

    // re-initialize game and show start modal
    init()
    toggleIntroModal()
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