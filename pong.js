//score
let scoreBoard = document.getElementById("score");
let oppenent = 0;
let player = 0;
let printScore =  oppenent + " - " + player;
scoreBoard.innerText += printScore;

//background canvas elements
let backCanvas = document.getElementById("backCanvas");
let backContext = backCanvas.getContext("2d");

//updating parts elements
let updateCanvas = document.getElementById("updateCanvas");
let updateContext = updateCanvas.getContext("2d");

//global Variables
let keyInput = "";
let dy = 1;
let dx = 4;
const AIplaces = [10, 250, 460];
let index = 220;
        

function ranNum(max) {
    return Math.floor(Math.random() * max);
}

console.log(ranNum(3));


//class for drawing rectangles
class rect {
    constructor (x, y, width, height, color, context) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;  
        this.context = context; 
    }

    draw () {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    ballUpdate (other) {
        this.context.clearRect(0, 0, 500, 500);
        this.draw();
        this.outline();

        this.y += dy;
        this.x += dx;
    }


    oppenentAI (ball) {
        this.draw();
        this.outline();
        let paddleCenter = this.y + 30;
        let ballCenter = ball.y + 10;
        //if on left side, center paddle
        if (ball.x > 250 ) {
            if (paddleCenter < AIplaces[index] && this.y < 440) {
                this.y += 3;
            }
            else if (this.y > 10) {
                this.y -= 3;
            }
            
        }
        else {
            index = ranNum(3);
        }
        //if on right side, center paddle and ball
        if (ball.x <= 250) {
            if (paddleCenter <= ballCenter && this.y < 430) {
                this.y += 3;
            }
            if (paddleCenter > ballCenter && this.y > 10) {
                this.y -= 3;
            }
            if (paddleCenter == ballCenter){
                console.log("centered");
            }
        }
    }

    paddleUpdate () {
        this.draw();
        this.outline();

        //moves based on key inputs
        if (keyInput == "ArrowUp" && this.y > 5) {
            this.y -= 4;
        }
        if (keyInput == "ArrowDown" && this.y < 435) {
            this.y += 4;
        }
    }

    collision (other) {
        //ball and paddle coords
        let ballRight = this.x + 20;
        let paddleRight = other.x + 10;
        let ballLen = this.y + 20;
        let paddleLen = other.y + 60;
        let ballCenter = this.y + 10;
        let paddleCenter = other.y + 30;

        //if the ball hits top or bottom of screen
        if (ballLen >= 500) {
            this.y = 479;
            dy = -dy;
        }
        if (this.y <= 0) {
            this.y = 1;
            dy = -dy;
        }

        //user paddke
        if (ballRight == other.x) {
            //hits center of player paddle
            if (ballCenter <= (paddleCenter + 5) && ballCenter >= (paddleCenter - 5)) {
                dx = -dx;
                console.log('hit center');
            }

            //hit top of player paddle 
            else if (ballCenter < paddleCenter - 5 && ballLen > other.y) {
                dx = -dx;
                dy += -(Math.abs((paddleCenter - ballCenter) / 15));
                console.log("hit top");
            }

            //hit bottom of player paddle
            else if (ballCenter > paddleCenter + 5 && this.y < paddleLen) {
                dx = -dx;
                dy += Math.abs((ballCenter - paddleCenter) / 15);
                console.log("hit bottom");
            }
        } 

        //oppenent paddle
        if (this.x == paddleRight) {
            //hits center of oppenent paddle
            if (ballCenter <= paddleCenter + 10 && ballCenter >= paddleCenter - 10) {
                dx = -dx;
            }

            //hits top of oppenent paddle
            else if (ballCenter < paddleCenter - 5 && ballLen > other.y) {
                dx = -dx;
                dy += -(Math.abs((paddleCenter - ballCenter) / 15));
                console.log("hit top");
            }

            //hits bottom of oppenent paddle
            else if (ballCenter > paddleCenter + 5 && this.y < paddleLen) {
                dx = -dx;
                dy += Math.abs((ballCenter - paddleCenter) / 15);
                console.log("hit bottom");
            }
        }

    }

    score () {
        //checks balls location and updates the scoreboard
        if (this.x + 20 >= 500) {
            //oppenent score
            oppenent += 1;
            printScore =  oppenent + " - " + player;
            scoreBoard.innerText = printScore;
            console.log("oppenent scored");
            this.x = 240;
            this.y = 0;
            dy = 0;
            dx = 0;
            
            setTimeout(() => {
                dy = -2;
                dx = 4;
            },  1000);
        }

        if (this.x <= 0) {
            //player score
            player +=1;
            printScore =  oppenent + " - " + player;   
            scoreBoard.innerText = printScore;
            console.log("player scored");
            this.x = 240;
            this.y = 0;
            dy = 0;
            dx = 0;
            setTimeout(() => {
                dy = -2;
                dx = -4;

            }, 1000);
            
        }

    }


    outline() {
        this.context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

//draws the line
let y = 10;
for (y; y < 500; y += 50) {
    let dot = new rect(245, y, 10, 30, "black", backContext);
    dot.draw();
}

//reads key presses
document.addEventListener("keydown", (event) => {
    keyInput = event["key"];
})

document.addEventListener("keyup", (event) => {
    keyInput = "";
})

//draws and updates the ball/paddle
let ball = new rect(100, 100, 20, 20, "white", updateContext);
let paddle = new rect(472, 100, 10, 60, "white", updateContext);
let oppenentPaddle = new rect (18, 100, 10, 60, "white", updateContext);

//updates the screen
function update(){
    requestAnimationFrame(update);
    ball.ballUpdate(paddle);
    paddle.paddleUpdate();
    oppenentPaddle.oppenentAI(ball);
    ball.collision(paddle);
    ball.collision(oppenentPaddle);
    ball.score();
    
}

update();