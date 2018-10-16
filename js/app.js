const LEFT = 0;
const RIGHT = 505;
const TOP = 130;
const BOTTOM = 400;
const BLOCK_WIDTH = 101;
const BLOCK_HEIGHT = 83;

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > RIGHT) {
        this.x = LEFT - 101;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
    }

    update() {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        if(key === 'left') {
            if(this.x - BLOCK_WIDTH < LEFT) return;
            this.x -= BLOCK_WIDTH;
        }
        if(key === 'right') {
            if(this.x + BLOCK_WIDTH > RIGHT) return;
            this.x += BLOCK_WIDTH;
        }
        if(key === 'down') {
            if(this.y + BLOCK_HEIGHT > BOTTOM) return;
            this.y += BLOCK_HEIGHT;
        }
        if(key === 'up') {
            if(this.y + BLOCK_HEIGHT < TOP) return;
            this.y -= BLOCK_HEIGHT;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemyRowOne = new Enemy(0,50,60);
const enemyRowTwo = new Enemy(0,140,30);
const enemyRowThree = new Enemy(0,230,40);

const allEnemies = [];
allEnemies.push(enemyRowOne);
allEnemies.push(enemyRowTwo);
allEnemies.push(enemyRowThree);

const player = new Player(203,BOTTOM);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
