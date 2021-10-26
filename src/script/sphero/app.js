import { Scanner, SpheroBolt } from './spherov2/lib/dist';

import { WHEEL_DIRECTION, ACCELEROMETER_AXIS, ACCELEROMETER_DIRECTION, BUTTON_STATE, BUTTON_TYPE, getButtonFromMidiMessage } from '../orbit/buttons.js';
import { initialize } from '../midi';

const ORBIT_INPUT_ID = '-1551502005';

const Direction = {
  Up: 0,
  Right: 90,
  Down: 180,
  Left: 270,
};

let bolt;

async function setup() {
  return initialize().then(({ inputs }) => {
    const orbitMidiInput = inputs.find((i) => i.id = ORBIT_INPUT_ID);

    orbitMidiInput.onmidimessage = handleMidiButtonPress;
  }).then(async () => {
    bolt = await Scanner.find(SpheroBolt.advertisement);

    if (!bolt) {
      throw new Error('No Bolt connected');
    }

    const battery = await bolt.batteryLevel();
    console.log(`Bolt connected - Battery ${Number(battery * 100).toFixed(2)}%`);

    await bolt.wake();
    console.log('Awake. Rolling');
    await bolt.rollTime(100, 0, 300, []);
  });
}

function handleMidiButtonPress(msg) {
  const button = getButtonFromMidiMessage(msg.data);

  let direction;

  switch (button.type) {
    case BUTTON_TYPE.KButton:
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

  if (typeof direction !== 'undefined') {
    return handleDirection(direction);
  }
}

function handleAccelerometer(button) {
  let direction;
  if (button.axis === ACCELEROMETER_AXIS.Horizontal) {
    direction = button.direction === ACCELEROMETER_DIRECTION.Left ? Direction.Left : Direction.Right;
  }
  else {
    direction = button.direction === ACCELEROMETER_DIRECTION.Forward ? Direction.Up : Direction.Down;
  }

  handleDirection(direction, false, button.velocity * 4);
}

async function handleDirection(direction, isButton = true, speed = 127) {
  if (isButton) {
    bolt.rollTime(speed, direction, 1000, []);
  }
  else {
    bolt.rollTime(speed, direction, 100, []);
  }
}

function start() {
  setup().catch(console.error);
}

document.getElementById('start').addEventListener('click', () => start());
