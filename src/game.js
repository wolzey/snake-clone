import axios from "axios";
import { Point } from "./index";
import Swal from "sweetalert2";

const Game = (canvas, options = { bricks: 100, interval: 20 }) => {
  const blockSize = canvas.height / options.bricks;
  const context = canvas.getContext("2d");

  return {
    player: null,
    food: null,
    canvas,
    context,
    blockSize,
    score: 0,
    interval: options.interval,
    timer: null,
    leaderboard: [],
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop() {
      const startButton = document.getElementById("start-game");
      startButton.hidden = false;
      clearInterval(this.timer);
    },
    async getScores() {
      const { data: scores } = await axios.get("https://snake-clone.herokuapp.com/scores");
      this.leaderboard = scores;
      const leaderboard = document.getElementById("leaderboard");
      const html = this.leaderboard.map(score => {
        return `<li>${score.username}: ${score.score}</li>`;
      });
      leaderboard.innerHTML = html.join("\n");
    },
    async sendScore() {
      const score = this.score;
      let username = localStorage.getItem("s:username");

      if (!username) {
        const { value } = await Swal.fire({
          title: "Enter your username",
          input: "text",
          showCancelButton: true
        });

        username = value;
      }

      localStorage.setItem("s:username", username);

      if (username) {
        axios.post("https://snake-clone.herokuapp.com/scores", { username, score });
      }

      return true;
    },
    handleKeydown(event) {
      if (!this.player) return;

      switch (event.keyCode) {
        case 37:
          if (this.player.velocity.x <= 0) {
            this.player.setVelocity(Point(-this.blockSize, 0));
          }
          break;
        case 38:
          if (this.player.velocity.y <= 0) {
            this.player.setVelocity(Point(0, -this.blockSize));
          }
          break;
        case 39:
          if (this.player.velocity.x >= 0) {
            this.player.setVelocity(Point(this.blockSize, 0));
          }

          break;
        case 40:
          if (this.player.velocity.y >= 0) {
            this.player.setVelocity(Point(0, this.blockSize));
          }
          break;
        default:
          break;
      }
    },
    setScore(score) {
      this.score = score;
      document.getElementById("score").innerText = `Score: ${this.score}`;
    },
    init(player, food) {
      document.addEventListener("keydown", this.handleKeydown.bind(this));
      this.player = player;
      this.food = food;
    },
    loop() {
      throw new Error("must be implemented");
    },
    start() {
      document.getElementById("start-game").hidden = true;
      this.timer = setInterval(this.loop, this.interval);
    },
    setGameSpeed(interval) {
      clearInterval(this.timer);
      this.interval = interval;
      this.start();
    }
  };
};

export default Game;
