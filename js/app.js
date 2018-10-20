const LEFT = 0;
const RIGHT = 505;
const TOP = 130;
const BOTTOM = 400;
const BLOCK_WIDTH = 101;
const BLOCK_HEIGHT = 83;
const ENEMY_ROW_TOP = 50;
const ENEMY_ROW_MIDDLE = 140;
const ENEMY_ROW_BOTTOM = 230;
const ROWS = [ENEMY_ROW_TOP,ENEMY_ROW_MIDDLE,ENEMY_ROW_BOTTOM];

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.height = 40;
    this.width = 80;
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

    // when the bug reaches the end of the screen,
    // it should start again off screen instead of
    // just appearing.
    if(this.x > RIGHT) {
        this.x = LEFT - BLOCK_WIDTH;
        this.speed = BLOCK_WIDTH + Math.floor(Math.random() * 300);
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
        this.height = 50;
        this.width = 60;
        this.sprite = 'images/char-boy.png';
        this.lives = 3;
        this.points = 0;
    }

    update() {
        this.checkCollision();
        scoreboard.update(game.level,player.lives,player.points);
        this.gameWon();
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    checkCollision() {
        for(const enemy of allEnemies) {
            if(this.x < enemy.x + enemy.width && 
               this.x + this.width > enemy.x && 
               this.y < enemy.y + enemy.height && 
               this.y + this.height > enemy.y) {
                this.respawn(true);
            }
        }

        for(const item of collectables) {
            if(!item.collected) {
                if(this.x < item.x + item.width && 
                   this.x + this.width > item.x && 
                   this.y < item.y + item.height && 
                   this.y + this.height > item.y) {
                    if(item instanceof GemStone) {
                        player.points += item.value;
                    }
                    if(item instanceof PowerUp) {
                        player.lives += item.value;
                    }
                    if(item instanceof DeathRock) {
                        if(allEnemies.length > 5) {
                            for(var i = 0;i < 3;i++) {
                                allEnemies.pop();
                            }
                        }
                    }
                    item.collected = true; 
                }
            }
        }
    }

    gameWon() {
        if(!(this.y < 0)) {
            return;
        }
        this.y = 0;
        game.nextLevel();
        setTimeout(() => this.respawn(),500);
    }

    handleInput(key) {
        if(key === 'left') {
            if(this.x - BLOCK_WIDTH < LEFT)  { return; }
            this.x -= BLOCK_WIDTH;
        }
        if(key === 'right') {
            if(this.x + BLOCK_WIDTH > RIGHT) { return; }
            this.x += BLOCK_WIDTH;
        }
        if(key === 'down') {
            if(this.y + BLOCK_HEIGHT > BOTTOM) { return; }
            this.y += BLOCK_HEIGHT;
        }
        if(key === 'up') {
            if(this.y + BLOCK_HEIGHT < TOP) { return; }
            this.y -= BLOCK_HEIGHT;
        }
    }

    respawn(died) {
        this.x = 203;
        this.y = BOTTOM;
        if(died) {
            this.lives--;
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemyRowOne = new Enemy(0,ENEMY_ROW_TOP, BLOCK_WIDTH + (Math.floor(Math.random() * 300)));
const enemyRowTwo = new Enemy(0,ENEMY_ROW_MIDDLE, BLOCK_WIDTH + (Math.floor(Math.random() * 300)));
const enemyRowThree = new Enemy(0,ENEMY_ROW_BOTTOM, BLOCK_WIDTH + (Math.floor(Math.random() * 300)));

const allEnemies = [];
allEnemies.push(enemyRowOne);
allEnemies.push(enemyRowTwo);
allEnemies.push(enemyRowThree);

const player = new Player(203,BOTTOM);

class Game {
    constructor(level=1) {
        this.level = level;
        this.won = false;
    }

    nextLevel() {
        collectables = [];
        this.level++;
        if(this.level % 2 === 0) {
            collectables.push(new GemStone(getRandomPosition(RIGHT),getRandomPosition(BOTTOM),'images/Gem Blue.png',50));
        }
        if(this.level % 3 === 0) {
            allEnemies.push(new Enemy(this.level * 10,ROWS[getRandomPosition(3)], BLOCK_WIDTH + (Math.floor(Math.random() * 300))));
        }
        if(this.level % 5 === 0) {
            collectables.push(new PowerUp(getRandomPosition(RIGHT),getRandomPosition(BOTTOM),'images/Heart.png',1));
        }
        if(this.level % 11 === 0) {
            collectables.push(new DeathRock(getRandomPosition(RIGHT),getRandomPosition(BOTTOM),'images/Rock.png'));
        }
        scoreboard.update(player.lives,player.points,this.level);
    }
}

const game = new Game(1);

class Collectable {
    constructor(x,y,sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.collected = false;
        this.width = BLOCK_WIDTH;
        this.height = BLOCK_HEIGHT;
    }

    update() {
        // remove items that have been marked collected (item.collected)
        collectables = collectables.filter(item => !item.collected);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class PowerUp extends Collectable {
    constructor(x,y,sprite,value) {
        super(x,y,sprite);
        this.value = value;
    }
}

class GemStone extends Collectable {
    constructor(x, y, sprite,value) {
        super(x,y,sprite);
        this.colors = ['images/Gem Blue.png',
                       'images/Gem Green.png',
                       'images/Gem Orange.png'];
        this.sprite = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.value = value;
    }
}

class DeathRock extends Collectable {
    constructor(x,y,sprite) {
        super(x,y,sprite);
    }
}

class Scoreboard {
    constructor(levelElement,livesElement,pointsElement) {
        this.level = levelElement;
        this.lives = livesElement;
        this.points = pointsElement;
    }

    update(level,lives, points) {
        this.level.innerText = level;
        this.lives.innerText = lives;
        this.points.innerText = points;
    }
}



const scoreboard = new Scoreboard(document.querySelector("#level"),
                                  document.querySelector("#lives"),
                                  document.querySelector("#points"));

function getRandomPosition(max) {
    return Math.floor(Math.random() * max);
}

let collectables = [];

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
