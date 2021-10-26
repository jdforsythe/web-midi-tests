import { initialize } from '../midi.js';
import { LaunchpadOutput } from '../launchpad/output.js';
import { getButtonFromMidiMessage, BUTTON_TYPE, WHEEL_DIRECTION, ACCELEROMETER_AXIS, ACCELEROMETER_DIRECTION, BUTTON_STATE } from '../orbit/buttons.js';
import { Direction, Game } from './snake.js';

const INITIAL_FRAME_RATE = 2;

const LAUNCHPAD_INPUT_ID = '-1688350944';
const LAUNCHPAD_OUTPUT_ID = '1495228527';
const ORBIT_INPUT_ID = '-1551502005';
const ORBIT_OUTPUT_ID = '-1655773664';

let game;

window.setup = function setup() {
  return initialize(handleMidiButtonPress).then(({ inputs, outputs }) => {
    const launchPadMidiOutput = outputs.find((o) => o.id === LAUNCHPAD_OUTPUT_ID);
    const orbitMidiInput = inputs.find((i) => i.id === ORBIT_INPUT_ID);

    orbitMidiInput.onmidimessage = handleMidiButtonPress;

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

  switch (button.type) {
    case BUTTON_TYPE.KButton: {
      if (button.index === 0) {
        return game.reset();
      }

      return;
    }

    case BUTTON_TYPE.PadBank:
    case BUTTON_TYPE.Bumper:
    case BUTTON_TYPE.Wheel: {
      return;
    }

    case BUTTON_TYPE.Pad: {
      if (button.state === BUTTON_STATE.Pressed) {
        return;
      }

      const [x, y] = button.coord;

      if (y === 0) {
        if (x === 0) {
          direction = Direction.Left;
          break;
        }
        else if (x === 1) {
          direction = Direction.Right;
          break;
        }
        else if (x === 3) {
          direction = Direction.Up;
          break;
        }
      }
      else if (y === 1 && x === 3) {
        direction = Direction.Down;
        break;
      }
      
      return;
    }

    case BUTTON_TYPE.Accelerometer: {
      return handleAccelerometer(button);
    }
  }

  if (direction) {
    return game.handleDirectionChange(direction);
  }
}

let _accelTimer;

function clearTimer() {
  clearTimeout(_accelTimer.timer);
  _accelTimer = undefined;
}

function startTimer(direction) {
  _accelTimer = {
    direction,
    timer: setTimeout(
      () => {
        return game.handleDirectionChange(direction);
      },
      1000 / getFrameRate(),
    ),
  };
}

function handleAccelerometer(button) {
  if (button.velocity < 30) {
    return;
  }

  let direction;
  if (button.axis === ACCELEROMETER_AXIS.Horizontal) {
    direction = button.direction === ACCELEROMETER_DIRECTION.Left ? Direction.Left : Direction.Right;
  }
  else {
    direction = button.direction === ACCELEROMETER_DIRECTION.Forward ? Direction.Up : Direction.Down;
  }

  // start or restart timer
  if (!_accelTimer || _accelTimer.direction === direction) {
    if (_accelTimer) {
      clearTimer();
    }

    return startTimer(direction);    
  }

  console.log(_accelTimer.direction === direction);

  // new direction
  const oldDirection = _accelTimer.direction;
  clearTimer();

  // send old direction immediately
  game.handleDirectionChange(oldDirection);
  // queue up new direction
  startTimer(direction);
}
