import Game from "./game";

const canvas = document.getElementById("game");
const SnakeGame = Game(canvas, { bricks: 50, interval: 50 });

export const Point = (x, y) => {
  return {
    x,
    y,
    draw(context, size) {
      context.fillRect(this.x, this.y, size, size);
    },
    add(point) {
      return Point(this.x + point.x, this.y + point.y);
    }
  };
};

export const Player = (game, name) => {
  const startingSegments = [
    Point(game.blockSize * 10, game.blockSize * 20),
    Point(game.blockSize * 9, game.blockSize * 20),
    Point(game.blockSize * 8, game.blockSize * 20),
    Point(game.blockSize * 7, game.blockSize * 20),
    Point(game.blockSize * 6, game.blockSize * 20),
    Point(game.blockSize * 5, game.blockSize * 20)
  ];
  return {
    velocity: Point(game.blockSize, 0),
    setVelocity(point) {
      this.velocity = point;
    },
    name,
    segments: startingSegments,
    draw() {
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].draw(game.context, game.blockSize);
      }
    },
    eatsFood(head) {
      return head.x === game.food.position.x && head.y === game.food.position.y;
    },
    checkEdges(head) {
      for (let i = 0; i < this.segments.length; i++) {
        const currentSegment = this.segments[i];

        if (head.x === currentSegment.x && head.y === currentSegment.y) {
          game.restart();
        }
      }
    },
    go() {
      // Add new segment to the front remove the last element
      const head = this.segments[0].add(this.velocity);

      if (head.x < 0) {
        head.x = game.canvas.width - game.blockSize;
      } else if (head.x > game.canvas.width) {
        head.x = 0 + game.blockSize;
      } else if (head.y < 0) {
        head.y = game.canvas.height - game.blockSize;
      } else if (head.y > game.canvas.height) {
        head.y = 0 + game.blockSize;
      }

      this.checkEdges(head);

      if (this.eatsFood(head)) {
        const tail = this.segments[this.segments.length - 1];
        game.setScore(game.score + 1);
        this.segments.push(Point(tail.x + game.blockSize, tail.y));

        game.food.destroy();
      }

      this.segments.unshift(head);
      this.segments.pop();

      this.draw();
    }
  };
};

const Food = game => {
  const createRandomPosition = () => {
    const x = Math.floor((game.canvas.width / game.blockSize) * Math.floor(Math.random() * game.blockSize));
    const y = Math.floor((game.canvas.height / game.blockSize) * Math.floor(Math.random() * game.blockSize));
    return Point(x, y);
  };

  return {
    position: createRandomPosition(),
    destroy() {
      this.position = createRandomPosition();
    },
    loop() {
      const originalColor = game.context.fillStyle;
      game.context.fillStyle = "red";
      this.position.draw(game.context, game.blockSize);
      game.context.fillStyle = originalColor;
    }
  };
};

SnakeGame.restart = function() {
  SnakeGame.player = Player(SnakeGame, "Ethan");
  SnakeGame.setScore(0);
};

SnakeGame.init(Player(SnakeGame, "Ethan"), Food(SnakeGame));
SnakeGame.loop = function() {
  SnakeGame.clear();
  SnakeGame.context.rect(0, 0, SnakeGame.canvas.width, SnakeGame.canvas.width);
  SnakeGame.context.stroke();
  SnakeGame.food.loop();
  SnakeGame.player.go();
};

SnakeGame.start();
