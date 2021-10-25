import { Display } from './display.js';

const STEP = 100;
const WIDTH = 800;
const HEIGHT = 800;

export const Direction = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3,
};

const DIRECTION_MAP = new Map([
  [Direction.Right, { move: (e) => e.x += STEP, isValid: (d) => d === Direction.Up || d === Direction.Down}],
  [Direction.Left, { move: (e) => e.x -= STEP, isValid: (d) => d === Direction.Up || d === Direction.Down}],
  [Direction.Up, { move: (e) => e.y -= STEP, isValid: (d) => d === Direction.Right || d === Direction.Left}],
  [Direction.Down, { move: (e) => e.y += STEP, isValid: (d) => d === Direction.Right || d === Direction.Left}],
]);

class Snake {
  direction;
  state = [];

  constructor() {
    this.direction = Direction.Right;

    this.state.push(
      { x: STEP * 2, y: 0, d: Direction.Right },
      { x: STEP, y: 0, d: Direction.Right },
      { x: 0, y: 0, d: Direction.Right },
    );
  }

  collision(x, y) {
    return this.state.some((s, index) => {
      return (!s.isNewTail) && s.x === x && s.y === y;
    });
  }

  collideSelf() {
    const [x, y] = this.getHead();

    return this.state.some((s, idx) => idx > 0 && (!s.isNewTail) && s.x === x && s.y === y);
  }

  getHead() {
    return [this.state[0].x, this.state[0].y];
  }

  isOutOfBounds() {
    const [x, y] = this.getHead();

    return x < 0 || x > WIDTH - STEP || y < 0 || y > HEIGHT - STEP;
  }
}

export class Game {
  gameOver;
  directionQueue;
  food = { x: 0, y: 0 };
  snake;
  display;

  constructor(launchPadOutput) {
    this.display = new Display(WIDTH, HEIGHT, STEP, launchPadOutput);

    this.reset();
  }

  reset() {
    this.gameOver = false;
    this.directionQueue = [];

    this.snake = new Snake();

    this.newFood();
  }

  newFood() {
    do {
      this.food.x = Math.floor(Math.random() *(WIDTH / STEP)) * STEP;
      this.food.y = Math.floor(Math.random() * (HEIGHT / STEP)) * STEP;
    } while (this.snake.collision(this.food.x, this.food.y));
  }

  foodIsEaten(headX, headY) {
    return headX === this.food.x && headY === this.food.y;
  }

  nextPosition(e) {
    DIRECTION_MAP.get(e.d).move(e);
  }

  handleDirectionChange(newDirection) {
    if (DIRECTION_MAP.get(this.snake.direction).isValid(newDirection)) {
      this.snake.direction = newDirection;
      const [headX, headY] = this.snake.getHead();
      this.directionQueue.push({ x: headX, y: headY, d: newDirection });
    }
  }

  draw() {
    this.display.drawGame(this.snake.state.length);
    this.display.drawFood(this.food.x, this.food.y);

    let newTail;

    if (this.snake.state[this.snake.state.length - 1].isNewTail) {
      newTail = { ...this.snake.state[this.snake.state.length - 2] };
    }

    this.snake.state.forEach((e, index) => {
      if (e.isNewTail) {
        e.x = newTail.x;
        e.y = newTail.y;
        e.d = newTail.d;
        delete e.isNewTail;

        this.display.drawSnakeCoord(e.x, e.y);

        return;
      }

      for (let dIndex = 0; dIndex < this.directionQueue.length; dIndex++) {
        const dItem = this.directionQueue[dIndex];

        if (dItem.x === e.x && dItem.y === e.y) {
          e.d = dItem.d;

          if (index === this.snake.state.length - 1) {
            this.directionQueue.splice(dIndex, 1);
          }
        }
      }

      this.nextPosition(e);

      this.display.drawSnakeCoord(e.x, e.y);
    });

    this.gameOver = this.snake.collideSelf() || this.snake.isOutOfBounds();

    if (this.gameOver) {
      this.display.drawGameOver(this.snake.state.length);

      return;
    }

    const [headX, headY] = this.snake.getHead();

    if (this.foodIsEaten(headX, headY)) {
      this.snake.state.push({ isNewTail: true });
      this.newFood();
      this.display.drawFood(this.food.x, this.food.y);
    }
  }
}
