import { Display } from './display.js';

const STEP = 100;
const WIDTH = 800;
const HEIGHT = 800;
const NUM_COLUMNS = WIDTH / STEP;
const NUM_ROWS = HEIGHT / STEP;

export class Game {
  display;
  board;
  boardBuffer;

  constructor(launchPadOutput) {
    this.display = new Display(WIDTH, HEIGHT, STEP, launchPadOutput);

    this.reset();
  }

  reset() {
    console.log('reset');
    this.board = this._randomizeBoard();
    this.boardBuffer = this._getEmptyBoard();
    this.display.init();
  }

  _getEmptyBoard() {
    const board = new Array(NUM_ROWS);

    for (let i = 0; i < NUM_ROWS; i++) {
      board[i] = new Array(NUM_COLUMNS).fill(0);
    }

    return board;
  }

  _randomizeBoard() {
    const board = this._getEmptyBoard();

    for (let i = 0; i < NUM_ROWS; i++) {
      for (let j = 0; j < NUM_COLUMNS; j++) {
        // line the edges with zeroes, fill the rest randomly
        board[i][j] = (i === 0 || j === 0 || i === NUM_ROWS - 1 || j === NUM_COLUMNS - 1) ? 0 : Math.floor(Math.random() * 2);
      }
    }

    return board;
  }

  draw() {
    console.log('this.draw()');
    this.nextGeneration();
    console.log(this.board);
    this.display.drawGame();

    for (let i = 0; i < NUM_ROWS; i++) {
      for (let j = 0; j < NUM_COLUMNS; j++) {
        if (this.board[i][j]) {
          this.display.drawLife(j, i);
        }
      }
    }
  }

  nextGeneration() {
    for (let x = 1; x < NUM_ROWS - 1; x++) {
      for (let y = 1; y < NUM_COLUMNS - 1; y++) {
        let neighbors = 0;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            neighbors += this.board[x + i][y + j];
          }
        }

        // since we added the current cell's value above, subtract it
        neighbors -= this.board[x][y];

        // rules of Conway's Game of Life

        // stasis is the default
        this.boardBuffer[x][y] = this.board[x][y];

        if (this.board[x][y] === 1) {
          // die of loneliness
          if (neighbors < 2) {
            this.boardBuffer[x][y] = 0;
          }
          // overpopulation
          else if (neighbors > 3) {
            this.boardBuffer[x][y] = 0;
          }
        }
        // reproduction
        else if (neighbors === 3) {
          this.boardBuffer[x][y] = 1;
        }
      }
    }

    this._copyBufferAndReset();
  }

  _copyBufferAndReset() {
    this.board = [...this.boardBuffer];
    this.boardBuffer = this._getEmptyBoard();
  }
}
