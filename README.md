# a brick breaker game™

**a brick breaker game™** is my take on Atari's classic arcade game, Breakout. 
The goal of the game is to destroy all the bricks on the screen by using the paddle to bounce the ball toward them, without letting the ball fall below the paddle.


## Screenshots:
#### Game Start
![game intro modal](screenshots/screenshot-start-modal.png)

#### Gameplay
![gameplay](screenshots/screenshot-gameplay.png)

#### Game Options Menu
![game options menu](screenshots/screenshot-options-menu.png)

### Result Modal
![result game modal](screenshots/screenshot-loss.png)


## Technologies Used:
JavaScript, HTML, CSS


## Getting Started:
[Click here](https://hlysllrs.github.io/unit-1-project/) to play the game.

Use the spacebar to launch the ball, and use the arrow keys to move the paddle.
You will have 4 chances to clear all of the bricks. 
Difficulty, number of players, and sound settings can be adjusted in the menu. 


## Next Steps: 
- implement the player's score in a more meaningful way, to it isn't always the same

- improve collisions to recognize the sides of bricks and the paddle

- improve ball movement direction and allow for more precise control of the ball's direction

- allow paddle to be moved before ball is launched

- prevent ball acceleration when spacebar is pressed after ball is launched

- add transitions between players' turns in 2-player mode

- add ability for game to be paused

- add different brick layouts

- add in power-ups and bonuses that drop from random bricks when hit:
    - extend paddle width
    - magnetic paddle 
    - multiple balls
    - ability to shoot at the bricks
    - bonus lives
    - bonus points

- add in different types of bricks 
    - bricks that require multiple hits to remove
    - barrier bricks that can not be removed

- improve sound effects to play for each brick hit

- improve responsive layout
    - improve resizing text when window size changes
    - change game orientation for smaller screens