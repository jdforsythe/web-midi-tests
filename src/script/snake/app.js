import { initialize } from '../midi.js';
import { LaunchpadOutput } from '../launchpad/output.js';
import { getButtonFromMidiMessage, BUTTON_DIRECTION } from '../arduino/buttons.js';
import { Direction, Game } from './snake.js';

const INITIAL_FRAME_RATE = 2;

const LAUNCHPAD_OUTPUT_ID = '1495228527';
const ARDUINO_INPUT_ID = '-545897131';

let game;

window.setup = function setup() {
  return initialize(handleMidiButtonPress).then(({ inputs, outputs }) => {
    const launchPadMidiOutput = outputs.find((o) => o.id === LAUNCHPAD_OUTPUT_ID);
    const arduinoMidiInput = inputs.find((i) => i.id === ARDUINO_INPUT_ID);

    arduinoMidiInput.onmidimessage = handleMidiButtonPress;

    launchPadOutput = new LaunchpadOutput(launchPadMidiOutput);

    game = new Game(launchPadOutput)
  });
}

window.draw = function draw() {
  if (!game || game.gameOver) {
    return;
  }

  frameRate(getFrameRate());

  game.draw();
}

function getFrameRate() {
  return Math.floor(game.snake.state.length / 10) + INITIAL_FRAME_RATE;
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

function handleMidiButtonPress(msg) {
  const button = getButtonFromMidiMessage(msg.data);

  let direction;

  switch (button.direction) {
    case BUTTON_DIRECTION.Up: {
      direction = Direction.Up;
      break;
    }
    case BUTTON_DIRECTION.Right: {
      direction = Direction.Right;
      break;
    }
    case BUTTON_DIRECTION.Down: {
      direction = Direction.Down;
      break;
    }
    case BUTTON_DIRECTION.Left: {
      direction = Direction.Left;
      break;
    }
  }

  if (direction) {
    return game.handleDirectionChange(direction);
  }
}
