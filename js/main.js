const AM = new AssetManager();

let cursor = { /* Arrow keys */
  'rightPressed': false,
  'leftPressed': false,
  'downPressed': false,
  'upPressed': false
};

class Animation {
  constructor(spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration,
    frames, loop) {
    this.spritesheet = spritesheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
  }

  drawFrame(tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.isDone()) {
      if (this.loop) {
        this.elapsedTime -= this.totalTime;
      }
    }
    let frame = this.currentFrame();

    let index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    let vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spritesheet.width) {
      index -= Math.floor((this.spritesheet.width - this.startX) / this.frameWidth);
      vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spritesheet.width) {
      index -= Math.floor(this.spritesheet.width / this.frameWidth);
      vindex++;
    }
    let locX = x;
    let locY = y;
    let offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spritesheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);
  }

  currentFrame() {
    return Math.floor(this.elapsedTime / this.frameDuration);
  }
 
  isDone() {
    return (this.elapsedTime >= this.totalTime);
  }
}

// no inheritance
class Background { //(game, spritesheet) {
  constructor(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
  }

  draw() {
    this.ctx.drawImage(this.spritesheet, this.x, this.y, 800, 700);
  }

  update() {

  };
}

class MushroomDude {

  constructor(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14) {
      this.x += this.game.clockTick * this.speed;
    }
    if (this.x > 800) {
      this.x = -230;
    }
  }
}

class SpriteSheet {
  constructor(asset, x, y) {
    this.asset = asset;
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
      ctx.drawImage(this.asset, this.x, this.y);
    }

  update() {
    console.log('Implement me!');
  }
}


class SpriteSheetFixed extends SpriteSheet {
  constructor(asset, x, y, sheetWidth, sheetHeight) {
    super(asset, x, y);
    this.sheetWidth = sheetWidth;
    this.sheetHeight = sheetHeight;
  }

  draw(ctx) {
    ctx.drawImage(this.asset, this.x, this.y, this.sheetWidth, this.sheetHeight);
  }

}
// constructor(spritesheet, startX = 0, startY = 0, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop) {
class SpriteSheetAnimated extends SpriteSheet {
  constructor(asset, x, y, frameWidth, frameHeight, sheetWidth, frameDuration, frames, isLoop) {
    super(asset, x, y);
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.isLoop = isLoop;
  }
}

class Entity {
  constructor(game, spritesheet, x, y) {
    this.game = game;
    this.spritesheet = spritesheet;
    this.x = x;
    this.y = y;
  }

}

class EntityAnimated extends Entity {

  constructor(game, spritesheet, x, y) {
    super(game, spritesheet, x, y);
    this.state1 = spritesheet.animation;

    this.animation = new Animation(this.spritesheet.asset,
        this.spritesheet.x,
        this.spritesheet.y,
        this.spritesheet.frameWidth,
        this.spritesheet.frameHeight,
        this.spritesheet.sheetWidth,
        this.spritesheet.frameDuration,
        this.spritesheet.frames,
        this.spritesheet.isLoop);
    this.speed = 100;
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    /* Here we check to see if any buttons where pressed and if our character is in the world */
    if (cursor.rightPressed) {
      this.x += this.game.clockTick * this.speed;
    } else if (cursor.leftPressed) {
      this.x -= this.game.clockTick * this.speed;
    }
    if (cursor.upPressed) {
      this.y -= this.game.clockTick * this.speed;
    } else if (cursor.downPressed && this.y >= 0) {
      this.y += this.game.clockTick * this.speed;
    }
    if (this.x > 800) {
        this.x = -32;
      }
  }

  get getAsset() {
    return this.spritesheet;
  }
}



class Enemy extends Entity {
  constructor(game, spritesheet, x, y) {
    super(game, spritesheet, x, y);
    this.animation = new Animation(spritesheet, 0, 0, 32, 32, 4, 0.1, 4, true);
    this.speed = 100;
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) {
      this.x = -80;
    }
  }
}



class EntityAnimated2 extends Entity {

  constructor(game, spritesheet, x, y) {
    super(game, spritesheet, x, y);
    this.animations = [];

    this.animation = new Animation(this.spritesheet.asset,
        this.spritesheet.x,
        this.spritesheet.y,
        this.spritesheet.frameWidth,
        this.spritesheet.frameHeight,
        this.spritesheet.sheetWidth,
        this.spritesheet.frameDuration,
        this.spritesheet.frames,
        this.spritesheet.isLoop);
    this.currentAnimation = this.animation;
    this.speed = 100;
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    /* Here we check to see if any buttons where pressed and if our character is in the world */
    if (cursor.rightPressed) {
      this.x += this.game.clockTick * this.speed;
    } else if (cursor.leftPressed) {
      this.x -= this.game.clockTick * this.speed;
    }
    if (cursor.upPressed) {
      this.y -= this.game.clockTick * this.speed;
    } else if (cursor.downPressed && this.y >= 0) {
      this.y += this.game.clockTick * this.speed;
    }
    if (this.x > 800) {
      this.x = -32;
    }
  }

  set setAnimation(int) {
    this.currentAnimation = this.animations[int];
  }

  get getAsset() {
    return this.spritesheet;
  }
}



AM.queueDownload("./img/background.png");
// AM.queueDownload('./img/mushroomdude.png');
// AM.queueDownload('./img/rougue_run_forward.png');
AM.queueDownload('./img/rogue like attack animations.png');

AM.downloadAll(function () {
  const canvas = document.getElementById('gameWorld');
  const ctx = canvas.getContext('2d');

  const gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();





  gameEngine.addEntity(new Background(gameEngine, AM.getAsset('./img/background.png')));

  // gameEngine.addEntity(new MushroomDude(gameEngine,
  //   AM.getAsset('./img/mushroomdude.png')));
  // gameEngine.addEntity(new DonJon(gameEngine, AM.getAsset('./img/rougue_run_forward.png')));


  let donJonAttackDown = new SpriteSheetAnimated(AM.getAsset('./img/rogue like attack animations.png'), 0, 0, 32, 32, 4, 0.1, 4, true);
  let donJonAttackUp = new SpriteSheetAnimated(AM.getAsset('./img/rogue like attack animations.png'), 0, 32, 32, 32, 4, 0.1, 4, true);

  gameEngine.addEntity(new EntityAnimated(gameEngine, donJonAttackDown, 0, 500));
  // gameEngine.addEntity(new EntityAnimated2(gameEngine, donJonAttackUp, 0, 250));
  // gameEngine.entities[1].animations = [donJonAttackDown];

  console.log('Finished downloading assets');
});
