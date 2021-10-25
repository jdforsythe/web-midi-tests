import { initialize } from '../midi.js';
import { LaunchpadOutput } from '../launchpad/output.js';
import { getButtonFromMidiMessage } from '../launchpad/buttons.js';
import { Direction, Game } from './snake.js';

const INITIAL_FRAME_RATE = 2;

let game;

window.setup = function setup() {
  return initialize(handleMidiButtonPress).then(({ output }) => {
    launchPadOutput = new LaunchpadOutput(output);
    game = new Game(launchPadOutput)
  });
}

window.draw = function draw() {
  if (!game || game.gameOver) {
    return;
  }

  frameRate(Math.floor(game.snake.state.length / 10) + INITIAL_FRAME_RATE);

  game.draw();
}

const keyDirectionMap = {
  UP_ARROW: Direction.Up,
  DOWN_ARROW: Direction.Down,
  LEFT_ARROW: Direction.Left,
  RIGHT_ARROW: Direction.Right,
};

window.keyPressed = function keyPressed() {
  game.handleDirectionChange(keyDirectionMap[keyCode]);
}

const buttonDirectionMap = {
  0: { 8: Direction.Left },
  1: { 8: Direction.Right },
  8: {
    6: Direction.Up,
    7: Direction.Down,
  },
};

function handleMidiButtonPress(msg) {
  const button = getButtonFromMidiMessage(msg);

  if (button.state === 1) {
    return;
  }

  if (button.x === 8 && button.y === 0) {
    return game.reset();
  }

  return game.handleDirectionChange(buttonDirectionMap[button.x]?.[button.y]);
}
