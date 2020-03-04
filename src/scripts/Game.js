const Game = function() {
  this.world = {
    blockSize: 16,
    player: new Game.Player(),
    food: new Game.Food(),
    height: 800,
    width: 800,
    update: function() {
      this.player.update();
    }
  };
  this.gameOver = new Game.AudioPlayer();
  this.update = function() {
    this.handleHeadCollision(this.world.player);
    this.world.update();
  };
};

Game.prototype = {
  nextPoint: function(point, velocity_x, velocity_y) {
    return new Game.Point(point.x + velocity_x, point.y + velocity_y);
  },
  handleHeadCollision: function(object) {
    const bodySegments = object.segments;
    const snakeHead = bodySegments[0];

    if (snakeHead.x >= this.world.width) {
      snakeHead.x = 0;
    }
    if (snakeHead.y > this.world.height) {
      snakeHead.y = 0;
    }
    if (snakeHead.x < 0) {
      snakeHead.x = this.world.width;
    }
    if (snakeHead.y < 0) {
      snakeHead.y = this.world.height;
    }

    for (let i = 1; i < this.world.player.segments.length; i++) {
      const current = this.world.player.segments[i];

      if (current.x === snakeHead.x && current.y === snakeHead.y) {
        this.gameOver.play();
        this.world.player = new Game.Player();
      }
    }

    if (
      Math.abs(snakeHead.x - this.world.food.position.x) < 12 &&
      Math.abs(snakeHead.y - this.world.food.position.y) < 12
    ) {
      this.world.player.addSection();
      this.world.food.audio.play();
      this.world.food.generateNewPosition(this.world.width, this.world.height);
    }
  }
};

Game.Point = function(x, y, direction = "right") {
  this.x = x;
  this.y = y;
  this.direction = direction;
};

Game.Point.prototype = {
  add: function(vx, vy) {
    return new Game.Point(this.x + vx, this.y + vy);
  }
};

Game.Player = function() {
  this.segments = [new Game.Point(80, 200), new Game.Point(70, 200), new Game.Point(60, 200)];

  this.vx = 8;
  this.vy = 0;

  this.update = function() {
    const newHead = this.segments[0].add(this.vx, this.vy);

    if (this.vx > 0) {
      newHead.direction = "right";
    } else if (this.vx < 0) {
      newHead.direction = "left";
    } else if (this.vy > 0) {
      newHead.direction = "down";
    } else if (this.vy < 0) {
      newHead.direction = "up";
    }

    this.segments.unshift(newHead);
    this.segments.pop();
  };

  this.setVelocity = function(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  };
};

Game.Player.prototype = {
  moveRight: function() {
    if (this.vx >= 0) this.setVelocity(8, 0);
  },
  moveLeft: function() {
    if (this.vx <= 0) this.setVelocity(-8, 0);
  },
  moveDown: function() {
    if (this.vy >= 0) this.setVelocity(0, 8);
  },
  moveUp: function() {
    if (this.vy <= 0) this.setVelocity(0, -8);
  },
  addSection: function() {
    const tail = this.segments[this.segments.length - 1];
    this.segments.push(tail);
  }
};

Game.Food = function() {
  this.audio = new Game.AudioPlayer();
  this.position = new Game.Point(100, 400);
  this.update = function() {};
};

Game.Food.prototype = {
  generateNewPosition: function(width, height) {
    const x = Math.floor((width / 8) * Math.floor(Math.random() * 8));
    const y = Math.floor((height / 8) * Math.floor(Math.random() * 8));
    this.position = new Game.Point(x, y);
  }
};

Game.AudioPlayer = function() {
  this.sound = null;
  this.setFile = function(file) {
    this.sound = document.createElement("audio");
    this.sound.src = file;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  };
};

Game.AudioPlayer.prototype = {
  play: function() {
    if (this.sound) this.sound.play();
  },
  stop: function() {
    if (this.sound) this.sound.pause();
  }
};

export default Game;
