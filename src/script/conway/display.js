import { COLORS } from '../launchpad/color';

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

    this.init();
  }

  init() {
    this._initBrowser();
    this._initMidi();
  }

  drawGame() {
    this._drawBrowserGame();
    this._drawMidiGame();
  }

  drawLife(x, y) {
    this._drawBrowserLife(x, y);
    this._drawMidiLife(x, y);
  }

  _initBrowser() {
    createCanvas(this.width, this.height);
  }

  _drawBrowserGame() {
    background(40);
  }

  _drawBrowserLife(x, y) {
    fill('red');
    rect(x * this.step, y * this.step, this.step, this.step);
  }

  _initMidi() {
    this.launchPadOutput.reset(0);
  }

  _drawMidiGame() {
    this.launchPadOutput.reset(0);
    this.launchPadOutput.setColor(COLORS.Green, [8, 0]);
  }

  _drawMidiLife(x, y) {
    this.launchPadOutput.setColor(COLORS.Red, [x, y]);
  }
}
