import { COLORS } from '../launchpad/color';
import { displayMessage } from '../launchpad/message.js';

export class Display {
  width;
  height;
  step;
  launchPadOutput;

  constructor(width, height, step, launchPadOutput) {
    this.width = width;
    this.height = height;
    this.step = step;

    this.launchPadOutput = launchPadOutput;

    this._initBrowser();
  }

  drawGame(score) {
    this._drawBrowserGame(score);
    this._drawMidiGame();
  }

  drawFood(x, y) {
    this._drawBrowserFood(x, y);
    this._drawMidiFood(x, y);
  }

  drawSnakeCoord(x, y) {
    this._drawBrowserSnakeCoord(x, y);
    this._drawMidiSnakeCoord(x, y);
  }

  drawGameOver(score) {
    this._drawBrowserGameOver(score);
    this._drawMidiGameOver(score);
  }

  _initBrowser() {
    createCanvas(this.width, this.height);
    textSize(18);
  }

  _drawBrowserGameOver(score) {
    background(40);
    text('Game Over', this.width / 2 - 50, this.height / 2);
    text('Score: ' + score, this.width / 2 - 30, this.height / 2 + 20);
  }

  _drawBrowserGame(score) {
    background(40);

    fill('white');
    text('score: ' + score, 725, 20);
  }

  _drawBrowserFood(x, y) {
    fill('red');
    rect(x, y, this.step, this.step);
  }

  _drawBrowserSnakeCoord(x, y) {
    fill('white');
    rect(x, y, this.step, this.step);
  }

  _drawMidiGame() {
    this.launchPadOutput.reset(0);
    this.launchPadOutput.setColor(COLORS.Amber, [0, 8]);
    this.launchPadOutput.setColor(COLORS.Amber, [1, 8]);
    this.launchPadOutput.setColor(COLORS.Amber, [8, 6]);
    this.launchPadOutput.setColor(COLORS.Amber, [8, 7]);
    this.launchPadOutput.setColor(COLORS.Green, [8, 0]);
  }

  async _drawMidiGameOver(score) {
    await displayMessage(this.launchPadOutput, `GAME OVER`, COLORS.Amber);
    this.launchPadOutput.setColor(COLORS.Green, [8, 0]);
  }

  _drawMidiFood(x, y) {
    this.launchPadOutput.setColor(COLORS.Red, [x / this.step, y / this.step]);
  }

  _drawMidiSnakeCoord(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }

    this.launchPadOutput.setColor(COLORS.Green, [x / this.step, y / this.step]);
  }
}
