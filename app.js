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
    - implement for 2 players
- wins
    - implement for 2 players (currently whoever loses first)
- tie if both players clear all bricks???
- improve responsive layout
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
let numOfPlayers = 1
let currentPlayer = 1

const players = {
    1: {
        playerName: 'player one',
        score: 0,
        lives: [1, 1, 1],
        bricks: []
    }, 
    '-1': {
        playerName: 'player two',
        score: 0,
        lives: [1, 1, 1],
        bricks: []
    }
}

let winner = null

let currentDifficulty = 'easy'

// define ball and brick attributes for each difficulty
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
        ballVY: 6, 
        paddleWidth: canvasEl.width / 12, 
        paddleSpeed: 7
    }, 
    hard: {
        ballRadius: canvasEl.height / 80, 
        ballVX: 3, 
        ballVY: 9, 
        paddleWidth: canvasEl.width / 15, 
        paddleSpeed: 9
    }
}

// define paddle layout
const paddle = {
    x: canvasEl.width / 2 - (difficulties[currentDifficulty].paddleWidth / 2),
    y: canvasEl.height - 20,
    width: canvasEl.width / 10,
    height: 10,
    vxl: 0,
    vxr: 0
}

// define ball layout
const ball = {
    y: paddle.y - difficulties[currentDifficulty].ballRadius - 1,
    x: canvasEl.width / 2,
    radius: canvasEl.height / 50,
    vx: -2,
    vy: -4
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

const soundStats = {
    status: 'on',
    volumeLevel: 0.1
}

const sounds = {
    brickSound: new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_008_17644.mp3'), 
    hitSound: new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_006_17642.mp3'), 
    gameOverSound: new Audio ('sounds/game-over-arcade-6435.mp3'), 
    winSound: new Audio('sounds/esm_8_bit_small_win_arcade_80s_simple_alert_notification_game.mp3'), 
    loseLifeSound: new Audio('sounds/blip-131856.mp3')
}
// const brickSound = new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_008_17644.mp3')
// brickSound.volume = sound.volumeLevel
// const hitSound = new Audio('sounds/zapsplat_multimedia_game_blip_generic_tone_006_17642.mp3')
// hitSound.volume = sound.volumeLevel
// const gameOverSound = new Audio ('sounds/game-over-arcade-6435.mp3')
// gameOverSound.volume = sound.volumeLevel
// const winSound = new Audio('sounds/esm_8_bit_small_win_arcade_80s_simple_alert_notification_game.mp3')
// winSound.volume = sound.volumeLevel
// const loseLifeSound = new Audio('sounds/blip-131856.mp3')
// loseLifeSound.volume = sound.volumeLevel

/*-----------------------------------------
cached DOM elements
------------------------------------------*/
const scoreEl = document.querySelector('#score')
const lifeEls = document.querySelectorAll('.life')
const playerEl = document.querySelector('#player')
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
const loseRestartBtn = document.querySelector('#lose-restart')
const winnerModal = document.querySelector('#winner-modal')
const winRestartBtn = document.querySelector('#win-restart')

/*-----------------------------------------
event listeners
------------------------------------------*/
// listen for begin button click (on intro modal)
startBtn.addEventListener('click', toggleIntroModal)

// listen for restart button click (on game over modal)
loseRestartBtn.addEventListener('click', restartGame)

// listen for restart button click (on winner modal)
winRestartBtn.addEventListener('click', restartGame)

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
    restartGame()
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
    restartGame()
})

// listen for sound buttons
soundBtnCont.addEventListener('click', (e) => {
    // ensure click was on a button
    if (e.target.nodeName !== 'BUTTON') return

    // change sound status to selected button
    const val = e.target.id.replace(/sound-/, '')
    soundStats.status = val

    // update selections in options menu
    setMenuSelections()
})

// listen for volume slider
volSlider.addEventListener('change', setVolume)

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
    setVolume()
    displayCurrentPlayer()
    drawBricks()
    drawBall()
    drawPaddle()
}

// reset screen with current state
function resetScreen() {
    setCanvasSize()
    displayCurrentPlayer()
    drawBall()
    drawPaddle()
    drawBricks()
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
        if (val == soundStats.status) {
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
    ball.y = paddle.y - difficulties[currentDifficulty].ballRadius - 1
    ball.vx = difficulties[currentDifficulty].ballVX
    ball.vy = difficulties[currentDifficulty].ballVY
    paddle.width = difficulties[currentDifficulty].paddleWidth
    paddle.x = canvasEl.width / 2 - (difficulties[currentDifficulty].paddleWidth / 2)
}

function setVolume() {
    // set volume to slider value
    soundStats.volume = volSlider.value / 100

    // set volume of each sound
    for(let sound in sounds) {
        sounds[sound].volume = soundStats.volume
    }

    // if volume slider is at 0, set sound status to off
    if(soundStats.volume === 0) soundStats.status =  'off'
    else soundStats.status = 'on'

    // update button selections on menu
    setMenuSelections()
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
    for(let player in players) {
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
            players[player].bricks.push(brickRow)
            brickLayout.y += brickLayout.height + brickLayout.yOffset
            brickLayout.x = canvasEl.width * .055
        }
        brickLayout.y = canvasEl.height * .05
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

// draw bricks in canvas
function drawBricks() {
    players[currentPlayer].bricks.forEach((row) => {
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

    checkForWinner()
    displayCurrentPlayer()

    // check if ball is within canvas area
    if(ball.y - ball.radius > canvasEl.height) {
        ball.x = canvasEl.width / 2,
        ball.y = canvasEl.height -30,
        paddle.x = canvasEl.width / 2 - (canvasEl.width / 10 / 2),
        paddle.y = canvasEl.height - 20,
        loseLife()
        resetScreen()
    } else if(winnerModal.style.display === 'block' || gameOverModal.style.display === 'block') {
        console.log(winner)
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
        if(soundStats.status === 'on') sounds.hitSound.play()
    }

    // detect top wall and paddle
    if(ball.y - ball.radius < 0) {
        ball.vy *= -1
        if(soundStats.status === 'on') sounds.hitSound.play()
    }

    // detect top of paddle
    if (ball.x + ball.radius > paddle.x && 
        ball.x - ball.radius < paddle.x + paddle.width && 
        ball.y + ball.radius > paddle.y && 
        ball.y - ball.radius < paddle.y + paddle.height) {
            ball.vy *= -1
            if(soundStats.status === 'on') sounds.hitSound.play()
    // detect left side of paddle
    } else if (ball.x + ball.radius >= paddle.x && 
        ball.x - ball.radius <= paddle.x + paddle.width * .01 &&
        ball.y + ball.radius >= paddle.y && 
        ball.y - ball.radius <= paddle.y + paddle.height) {
            ball.vx *= -1
            if(soundStats.status === 'on') sounds.hitSound.play()
    // detect right side of paddle
    } else if (ball.x + ball.radius >= paddle.x && 
        ball.x - ball.radius <= paddle.x + paddle.width * .99 &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height) {
            ball.vx *= -1
            if(soundStats.status === 'on') sounds.hitSound.play()
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

    players[currentPlayer].bricks.forEach((row, i) => {
        row.forEach((brick, j) => {
            // detect top of bricks
            if (ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height * .01) {
                    // reverse ball y direction
                    ball.vy *= -1
                    // clear brick and remove from array
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)
                    // increase score
                    players[currentPlayer].score += 100
                    // play sound (if sound is on)
                    if(soundStats.status === 'on') sounds.brickSound.play()
                    console.log('hit top')
            // detect bottom of bricks
            } else if(ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y + brick.height * .99 &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vy *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)   
                    players[currentPlayer].score += 100
                    if(soundStats.status === 'on') sounds.brickSound.play()
                    console.log('hit bottom')
            // detect left side of bricks
            } else if (ball.x + ball.radius >= brick.x && 
                ball.x - ball.radius <= brick.x + brick.width * .01 &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vx *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)
                    players[currentPlayer].score += 100
                    if(soundStats.status === 'on') sounds.brickSound.play()
                    console.log('hit left')
            // detect right side of bricks
            } else if (ball.x + ball.radius >= brick.x + brick.width * .99 && 
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height) {
                    ball.vx *= -1
                    ctx.clearRect(brick.x, brick.y, brick.width, brick.height)
                    row.splice(j, 1)
                    players[currentPlayer].score += 100
                    if(soundStats.status === 'on') sounds.brickSound.play()
                    console.log('hit right')
            }
        })
    })
}

function loseLife() {
    // check for first 1 (usable life) in lives array
    const lifeIdx = players[currentPlayer].lives.indexOf(1)

    // if no usable lives present, game over
    if(lifeIdx === -1) {
        gameOver()
    } else {
        // change life value to 0
        players[currentPlayer].lives[lifeIdx] = 0
        if(soundStats.status === 'on') sounds.loseLifeSound.play()
    }

    // change players if in two player mode
    if(numOfPlayers == 2) currentPlayer *= -1
}

function checkForWinner() {
    // check if each player's bricks are cleared
    for(let player in players) {
        // count number of empty rows
        let rowsCleared = 0
        players[player].bricks.forEach((row) => {
            if(row.length === 0) rowsCleared++
        })

        // if all rows are cleared, declare winner
        if(rowsCleared === 9) {
            winner = player
            showWinner()
        }
    }
}

function gameOver() {
    // play game over sound
    if(soundStats.status === 'on') sounds.gameOverSound.play()

    // show game over modal
    gameOverModal.style.display = 'block'
}

function showWinner() {
    // update DOM with winner name
    const winnerEl = document.querySelector('#winner')
    winnerEl.innerText = `congrats ${players[winner].playerName}`

    // play win sound
    if(soundStats.status === 'on') sounds.winSound.play()

    // show winner modal
    winnerModal.style.display = 'block'
}

function displayCurrentPlayer() {
    // display player name
    playerEl.innerText = players[currentPlayer].playerName

    // display score
    scoreEl.innerHTML = `score: ${players[currentPlayer].score}`

    // display lives
    players[currentPlayer].lives.forEach((life, i) => {
        switch (life) {
            case 0: 
                // if life is 0, display as empty
                lifeEls[i].style.backgroundColor = '#f4f4f4'
                break
            case 1: 
                // if life is 1, display as filled
                lifeEls[i].style.backgroundColor = '#000000'
                break
        }
    })
}

function restartGame() {
    clearCanvas()

    // hide game over modal and winer modal
    gameOverModal.style.display = 'none'
    winnerModal.style.display = 'none'
    
    for(let player in players) {
        // remove all remaining bricks from bricks each player's array
        players[player].bricks.splice(0, players[player].bricks.length)
        // reset each player's score to 0
        players[player].score = 0
        // reset each player to full lives
        players[player].lives.splice(0, 3, 1, 1, 1)
    }

    // reset brick layout start positions
    brickLayout.x = canvasEl.width * .055, 
    brickLayout.y = canvasEl.height * .05, 

    // reset ball x position
    ball.x = canvasEl.width / 2

    // reset current player to player one
    currentPlayer = 1

    // re-initialize game and show start modal
    init()
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
https://www.zapsplat.com/

*/