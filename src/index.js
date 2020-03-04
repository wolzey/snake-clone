import Game from "./scripts/Game";
import Engine from "./scripts/Engine";
import Display from "./scripts/Display";
import Controller from "./scripts/Controller";

import SnakeSheet from "./assets/blue_snake.png";
import ChewSound from "./assets/chew.mp3";
import GameOver from "./assets/gameover.mp3";

const tile_sheet = new Image();
tile_sheet.src = SnakeSheet;

const canvas = document.querySelector("canvas");

const keyDownUp = function(event) {
  controller.keyDownUp(event.type, event.keyCode);
};

const update = function() {
  if (controller.left.active) {
    game.world.player.moveLeft();
  } else if (controller.right.active) {
    game.world.player.moveRight();
  } else if (controller.up.active) {
    game.world.player.moveUp();
  } else if (controller.down.active) {
    game.world.player.moveDown();
  }

  game.update();
};

const render = function() {
  display.clear();
  display.drawFruit(tile_sheet, 15, 64, game.world.food);
  display.drawSnake(tile_sheet, 15, 64, game.world.player.segments);
  display.render();
};

const resize = function() {
  display.resize(document.documentElement.clientWidth - 60, document.documentElement.clientHeight - 60, 1);
  display.render();
};

const game = new Game();
const display = new Display(canvas);
const engine = new Engine(1000 / 30, update, render);
const controller = new Controller();

display.buffer.canvas.height = game.world.height;
display.buffer.canvas.width = game.world.width;
display.buffer.imageSmoothingEnabled = false;

game.world.food.audio.setFile(ChewSound);
game.gameOver.setFile(GameOver);

window.addEventListener("resize", resize);
window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup", keyDownUp);

tile_sheet.addEventListener("load", () => {
  resize();
  engine.start();
});
