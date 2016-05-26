const DOWN = 0;
const UP = 1;
const LEFT = 2;
const RIGHT = 3;
const DIAM = 23;
var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

/******************************
            KAIN
******************************/
function Kain(game, spritesheet, x, y) {
	this.right = new Animation(spritesheet, 0, 32, 23, 30, .15, 3, true, false);
	this.left = new Animation(spritesheet, 0, 95, 23, 30, .15, 3, true, false);
	this.up = new Animation(spritesheet, 0, 0, 23, 30, .15, 3, true, false);
	this.down = new Animation(spritesheet, 0, 62, 23, 30, .15, 3, true, false);
	this.stopRight = new Animation(spritesheet, 0, 32, 23, 30, .15, 1, true, false);
	this.kneel = new Animation(spritesheet, 346, 35, 23, 30, .15, 1, true, false);
	this.fall = new Animation(spritesheet, 395, 0, 23, 30, .15, 1, true, false);
	this.hp = 10;
	this.damage = 5;
	this.scale = 2;
	this.x = x;
	this.y = y;
	this.speed = 100;
	this.level = 1;
	this.counter = 0;
	this.deathCounter = 0;
	this.dir = Math.floor(Math.random() * 5);
	this.game = game;
	this.ctx = game.ctx;
}

Kain.prototype.draw = function (ctx) {
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case RIGHT:
                this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case LEFT:
                this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            default:
                this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        }
    } else this.deathCounter++;

    if (this.deathCounter > 0 && this.deathCounter < 10) this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    else if (this.deathCounter >= 10) this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

Kain.prototype.update = function () {
    this.counter += 1;
    if (this.counter == 1000) this.counter = 0;
    if (this.counter % 20 == 0)
        getDir(this);
        //this.dir = Math.floor(Math.random() * 5);
    
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.y -= this.game.clockTick * this.speed;
                break;
            case RIGHT:
                this.x += this.game.clockTick * this.speed;
                break;
            case LEFT:
                this.x -= this.game.clockTick * this.speed;
                break;
            default:
                this.y += this.game.clockTick * this.speed;
                break;
        }
        if (this.x > 706) this.dir = LEFT;
        else if (this.x < 1) this.dir = RIGHT;
        if (this.y > 470) this.dir = UP;
        else if (this.y < 1) this.dir = DOWN;
    }
    collide(this);
    if (this.hp == 0) console.log("Kain Died!");
}

/******************************
            DKCecil
******************************/
function DKCecil(game, spritesheet, x, y) {
    this.left = new Animation(spritesheet, 144, 95, 23, 30, .15, 3, true, false);
    this.right = new Animation(spritesheet, 144, 30, 23, 30, .15, 3, true, false);
    this.up = new Animation(spritesheet, 144, 0, 23, 30, .15, 3, true, false);
    this.down = new Animation(spritesheet, 144, 60, 23, 30, .15, 3, true, false);
	this.stopLeft = new Animation(spritesheet, 144, 95, 23, 30, .15, 1, true, false);
	this.hit = new Animation(spritesheet, 319, 29, 23, 30, .15, 1, true, false);
	this.kneel = new Animation(spritesheet, 292, 0, 23, 30, .15, 1, true, false);
	this.fall = new Animation(spritesheet, 292, 32, 23, 30, .15, 1, true, false);
	this.scale = 2;
	this.x = x;
	this.y = y;
	this.hp = 10;
	this.damage = 5;
	this.speed = 100;
	this.counter = 0;
	this.level = 1;
	this.deathCounter = 0;
	this.dir = Math.floor(Math.random() * 5);
	this.isHit = false;
	this.isKneel = false;
	this.isDown = false;
	this.game = game;
	this.ctx = game.ctx;
}

DKCecil.prototype.draw = function (ctx) {
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case RIGHT:
                this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case LEFT:
                this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            default:
                this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        }
    } else this.deathCounter++;

    if (this.deathCounter > 0 && this.deathCounter < 10) this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    else if (this.deathCounter >= 10) this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

DKCecil.prototype.update = function () {
    this.counter += 1;
    if (this.counter == 1000) this.counter = 0;
    if (this.counter % 20 == 0)
        getDir(this);
    //    this.dir = Math.floor(Math.random() * 5);
    
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.y -= this.game.clockTick * this.speed;
                break;
            case RIGHT:
                this.x += this.game.clockTick * this.speed;
                break;
            case LEFT:
                this.x -= this.game.clockTick * this.speed;
                break;
            default:
                this.y += this.game.clockTick * this.speed;
                break;
        }
        if (this.x > 706) this.dir = LEFT;
        else if (this.x < 1) this.dir = RIGHT;
        if (this.y > 470) this.dir = UP;
        else if (this.y < 1) this.dir = DOWN;
    }
    collide(this);
    if (this.hp == 0) console.log("DKCecil Died!");
}


/******************************
            Cecil
******************************/
function Cecil(game, spritesheet, x, y) {
    this.left = new Animation(spritesheet, 71, 95, 23, 30, .15, 3, true, false);
    this.right = new Animation(spritesheet, 71, 30, 23, 30, .15, 3, true, false);
    this.up = new Animation(spritesheet, 71, 0, 23, 30, .15, 3, true, false);
    this.down = new Animation(spritesheet, 71, 60, 23, 30, .15, 3, true, false);
    this.kneel = new Animation(spritesheet, 320, 130, 23, 30, .15, 1, true, false);
    this.fall = new Animation(spritesheet, 320, 160, 23, 30, .15, 1, true, false);
    this.scale = 2;
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.damage = 5;
    this.speed = 100;
    this.counter = 0;
    this.level = 1;
    this.deathCounter = 0;
    this.dir = Math.floor(Math.random() * 5);
    this.isHit = false;
    this.isKneel = false;
    this.isDown = false;
    this.game = game;
    this.ctx = game.ctx;
}

Cecil.prototype.draw = function (ctx) {
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case RIGHT:
                this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case LEFT:
                this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            default:
                this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        }
    } else this.deathCounter++;

    if (this.deathCounter > 0 && this.deathCounter < 10) this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    else if (this.deathCounter >= 10) this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

Cecil.prototype.update = function () {
    this.counter += 1;
    if (this.counter == 1000) this.counter = 0;
    if (this.counter % 20 == 0)
        getDir(this);
       // this.dir = Math.floor(Math.random() * 5);
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.y -= this.game.clockTick * this.speed;
                break;
            case RIGHT:
                this.x += this.game.clockTick * this.speed;
                break;
            case LEFT:
                this.x -= this.game.clockTick * this.speed;
                break;
            default:
                this.y += this.game.clockTick * this.speed;
                break;
        }
        if (this.x > 706) this.dir = LEFT;
        else if (this.x < 1) this.dir = RIGHT;
        if (this.y > 470) this.dir = UP;
        else if (this.y < 1) this.dir = DOWN;
    }
    collide(this);
    if (this.hp == 0) console.log("Cecil Died!");
}

/******************************
            Rydia
******************************/
function Rydia(game, spritesheet, x, y) {
    this.left = new Animation(spritesheet, 0, 220, 23, 30, .15, 3, true, false);
    this.right = new Animation(spritesheet, 0, 160, 23, 30, .15, 3, true, false);
    this.up = new Animation(spritesheet, 0, 130, 23, 30, .15, 3, true, false);
    this.down = new Animation(spritesheet, 0, 190, 23, 30, .15, 3, true, false);
    this.kneel = new Animation(spritesheet, 370, 0, 23, 30, .15, 1, true, false);
    this.fall = new Animation(spritesheet, 395, 95, 23, 30, .15, 1, true, false);
    this.scale = 2;
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.damage = 5;
    this.speed = 100;
    this.counter = 0;
    this.level = 1;
    this.deathCounter = 0;
    this.dir = Math.floor(Math.random() * 5);
    this.isHit = false;
    this.isKneel = false;
    this.isDown = false;
    this.game = game;
    this.ctx = game.ctx;
}

Rydia.prototype.draw = function (ctx) {
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case RIGHT:
                this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case LEFT:
                this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            default:
                this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        }
    } else this.deathCounter++;

    if (this.deathCounter > 0 && this.deathCounter < 10) this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    else if (this.deathCounter >= 10) this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

Rydia.prototype.update = function () {
    this.counter += 1;
    if (this.counter == 1000) this.counter = 0;
    if (this.counter % 20 == 0)
        getDir(this);
       // this.dir = Math.floor(Math.random() * 5);
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.y -= this.game.clockTick * this.speed;
                break;
            case RIGHT:
                this.x += this.game.clockTick * this.speed;
                break;
            case LEFT:
                this.x -= this.game.clockTick * this.speed;
                break;
            default:
                this.y += this.game.clockTick * this.speed;
                break;
        }
        if (this.x > 706) this.dir = LEFT;
        else if (this.x < 1) this.dir = RIGHT;
        if (this.y > 470) this.dir = UP;
        else if (this.y < 1) this.dir = DOWN;
    }
    collide(this);
    if (this.hp == 0) console.log("Rydia Died!");
}

/******************************
        Caller Rydia
******************************/
function CallerRydia(game, spritesheet, x, y) {
    this.left = new Animation(spritesheet, 73, 220, 23, 30, .15, 3, true, false);
    this.right = new Animation(spritesheet, 73, 160, 23, 30, .15, 3, true, false);
    this.up = new Animation(spritesheet, 73, 130, 23, 30, .15, 3, true, false);
    this.down = new Animation(spritesheet, 73, 190, 23, 30, .15, 3, true, false);
    this.kneel = new Animation(spritesheet, 375, 125, 23, 30, .15, 1, true, false);
    this.fall = new Animation(spritesheet, 395, 190, 23, 30, .15, 1, true, false);
    this.scale = 2;
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.damage = 5;
    this.speed = 100;
    this.counter = 0;
    this.level = 1;
    this.deathCounter = 0;
    this.dir = Math.floor(Math.random() * 5);
    this.isHit = false;
    this.isKneel = false;
    this.isDown = false;
    this.game = game;
    this.ctx = game.ctx;
}

CallerRydia.prototype.draw = function (ctx) {
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case RIGHT:
                this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case LEFT:
                this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            default:
                this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        }
    } else this.deathCounter++;

    if (this.deathCounter > 0 && this.deathCounter < 10) this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    else if (this.deathCounter >= 10) this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

CallerRydia.prototype.update = function () {
    this.counter += 1;
    if (this.counter == 1000) this.counter = 0;
    if (this.counter % 20 == 0)
        getDir(this);
        //this.dir = Math.floor(Math.random() * 5);
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.y -= this.game.clockTick * this.speed;
                break;
            case RIGHT:
                this.x += this.game.clockTick * this.speed;
                break;
            case LEFT:
                this.x -= this.game.clockTick * this.speed;
                break;
            default:
                this.y += this.game.clockTick * this.speed;
                break;
        }
        if (this.x > 706) this.dir = LEFT;
        else if (this.x < 1) this.dir = RIGHT;
        if (this.y > 470) this.dir = UP;
        else if (this.y < 1) this.dir = DOWN;
    }
    collide(this);
    if (this.hp == 0) console.log("Caller Rydia Died!");
}

/******************************
            Rosa
******************************/
function Rosa(game, spritesheet, x, y) {
    this.left = new Animation(spritesheet, 220, 95, 23, 30, .15, 3, true, false);
    this.right = new Animation(spritesheet, 220, 30, 23, 30, .15, 3, true, false);
    this.up = new Animation(spritesheet, 220, 0, 23, 30, .15, 3, true, false);
    this.down = new Animation(spritesheet, 220, 60, 23, 30, .15, 3, true, false);
    this.kneel = new Animation(spritesheet, 422, 190, 23, 30, .15, 1, true, false);
    this.fall = new Animation(spritesheet, 422, 225, 23, 30, .15, 1, true, false);
    this.scale = 2;
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.damage = 5;
    this.speed = 100;
    this.counter = 0;
    this.level = 1;
    this.deathCounter = 0;
    this.dir = Math.floor(Math.random() * 5);
    this.isHit = false;
    this.isKneel = false;
    this.isDown = false;
    this.game = game;
    this.ctx = game.ctx;
}

Rosa.prototype.draw = function (ctx) {
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case RIGHT:
                this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            case LEFT:
                this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
                break;
            default:
                this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        }
    } else this.deathCounter++;

    if (this.deathCounter > 0 && this.deathCounter < 10) this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    else if (this.deathCounter >= 10) this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

Rosa.prototype.update = function () {
    this.counter += 1;
    if (this.counter == 1000) this.counter = 0;
    if (this.counter % 20 == 0)
        getDir(this);
        //this.dir = Math.floor(Math.random() * 5);
    if (this.hp > 0) {
        switch (this.dir) {
            case UP:
                this.y -= this.game.clockTick * this.speed;
                break;
            case RIGHT:
                this.x += this.game.clockTick * this.speed;
                break;
            case LEFT:
                this.x -= this.game.clockTick * this.speed;
                break;
            default:
                this.y += this.game.clockTick * this.speed;
                break;
        }
        if (this.x > 706) this.dir = LEFT;
        else if (this.x < 1) this.dir = RIGHT;
        if (this.y > 470) this.dir = UP;
        else if (this.y < 1) this.dir = DOWN;
    }
    collide(this);
    if (this.hp == 0) console.log("Rosa Died!");
}

/**************************************
          MAIN FUNCTIONS
**************************************/
AM.queueDownload("./img/BG.jpg");
AM.queueDownload("./img/ffiv.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/BG.jpg")));

    addPlayers(gameEngine);
	
	//gameEngine.addEntity(new Cecil(gameEngine, AM.getAsset("./img/ffiv.png")));

    console.log("All Done!");
});

function addPlayers(game) {
    var players = Math.floor(Math.random() * 3) + 4;
    var placed = [];

    for (var i = 25; players > 0 && i > 0; i--) {
        var character = Math.floor(Math.random() * 6);
        console.log(character);
        if (placed.indexOf(character) == -1) {
            switch (character) {
                case 0:
                    var kain = new Kain(game, AM.getAsset("./img/ffiv.png"), Math.floor(Math.random() * 680) + 15, Math.floor(Math.random() * 450) + 15);
                    game.addEntity(kain);
                    game.allPlayers.push(kain);
                    placed.push(0);
                    players -= 1;
                    break;
                case 1:
                    var dkCecil = new DKCecil(game, AM.getAsset("./img/ffiv.png"), Math.floor(Math.random() * 680) + 15, Math.floor(Math.random() * 450) + 15);
                    game.addEntity(dkCecil);
                    game.allPlayers.push(dkCecil);
                    placed.push(1);
                    players -= 1;
                    break;
                case 2:
                    var cecil = new Cecil(game, AM.getAsset("./img/ffiv.png"), Math.floor(Math.random() * 680) + 15, Math.floor(Math.random() * 450) + 15);
                    game.addEntity(cecil);
                    game.allPlayers.push(cecil);
                    placed.push(2);
                    players -= 1;
                    break;
                case 3:
                    console.log("RYDIA");
                    var rydia = new Rydia(game, AM.getAsset("./img/ffiv.png"), Math.floor(Math.random() * 680) + 15, Math.floor(Math.random() * 450) + 15);
                    game.addEntity(rydia);
                    game.allPlayers.push(rydia);
                    placed.push(3);
                    players -= 1;
                    break;
                case 4:
                    var caller = new CallerRydia(game, AM.getAsset("./img/ffiv.png"), Math.floor(Math.random() * 680) + 15, Math.floor(Math.random() * 450) + 15);
                    game.addEntity(caller);
                    game.allPlayers.push(caller);
                    placed.push(4);
                    players -= 1;
                    break;
                case 5:
                    var rosa = new Rosa(game, AM.getAsset("./img/ffiv.png"), Math.floor(Math.random() * 680) + 15, Math.floor(Math.random() * 450) + 15);
                    game.addEntity(rosa);
                    game.allPlayers.push(rosa);
                    placed.push(5);
                    players -= 1;
                    break;
                default:
                    break;
            }
        }
        
    }
}

function collide(ent) {
    for (var i = 0; i < ent.game.allPlayers.length; i++) {
        var other = ent.game.allPlayers[i];
        if (! (other == ent) && other.hp > 0 && ent.hp > 0) {
            if (dist(other, ent) < DIAM) {
                if (Math.floor(Math.random() * 2)) {
                    other.hp -= ent.damage;
                    if (other.hp > 0)
                        ent.hp -= other.damage;
                } else {
                    ent.hp -= other.damage;
                    if (ent.hp > 0)
                        other.hp -= ent.damage;
                }
                
                other.dir = (other.dir - 2) % 4;
                ent.dir = (ent.dir - 2) % 4;

                if (ent.hp > 0 && other.hp < 1) levelUp(ent);
                else if (ent.hp < 1 && other.hp > 0) levelUp(other);
            }
        }
    }
}

function dist(other, ent) {
    xValues = other.x - ent.x - 11.5;
    yValues = other.y - ent.y - 11.5;
    return Math.sqrt((xValues * xValues) + (yValues * yValues));
}

function levelUp(ent) {
    ent.hp += 5;
    ent.damage += 2;
    ent.speed += 50;
    ent.level += 1;
}

function getDir(ent) {
    var target, distance;
    if (ent != ent.game.allPlayers[0]) {
        target = ent.game.allPlayers[0];
        distance = dist(ent, target);
    } else {
        target = ent.game.allPlayers[1];
        distance = dist(ent, target);
    }
    for (var i = 0; i < ent.game.allPlayers.length; i++) {
        temp = ent.game.allPlayers[i];
        if (ent != temp && (dist(ent, temp) < distance && temp.hp > 0 || target.hp < 1)) {
            target = temp;
            distance = dist(ent, target);
        }
    }
    if (target.level > ent.level) {
        if (target.x > ent.x && target.y > ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = LEFT;
            else ent.dir = UP;
        }
        else if (target.x > ent.x && target.y < ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = LEFT;
            else ent.dir = DOWN;
        }
        else if (target.x < ent.x && target.y > ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = RIGHT;
            else ent.dir = UP;
        }
        else if (target.x < ent.x && target.y < ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = RIGHT;
            else ent.dir = DOWN;
        }
    }
    else if (target.level <= ent.level) {
        if (target.x > ent.x && target.y > ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = RIGHT;
            else ent.dir = DOWN;
        }
        else if (target.x > ent.x && target.y < ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = RIGHT;
            else ent.dir = UP;
        }
        else if (target.x < ent.x && target.y > ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = LEFT;
            else ent.dir = DOWN;
        }
        else if (target.x < ent.x && target.y < ent.y) {
            if (Math.floor(Math.random() * 2)) ent.dir = LEFT;
            else ent.dir = UP;
        }
    }
}