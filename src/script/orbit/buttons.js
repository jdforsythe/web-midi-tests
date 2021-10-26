export const BUTTON_TYPE = {
Pad: 1,
KButton: 2,
PadBank: 3,
  Wheel: 4,
  Bumper: 5,
  Accelerometer: 6,
};

export const WHEEL_DIRECTION = {
  CounterClockwise: 1,
  Clockwise: 2,
};

export const ACCELEROMETER_AXIS = {
  Horizontal: 1,
  Vertical: 2,
};

export const ACCELEROMETER_DIRECTION = {
  Left: 1,
  Right: 2,
  Forward: 3,
  Backward: 4,
};

export const BUTTON_STATE = {
  Unpressed: 0,
  Pressed: 1,
};

const BUTTONS = {
  // regular pad pressed
  144: {
    36: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [0, 0] },
    37: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [1, 0] },
    38: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [2, 0] },
    39: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [3, 0] },
    40: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [0, 1] },
    41: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [1, 1] },
    42: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [2, 1] },
    43: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [3, 1] },
    44: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [0, 2] },
    45: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [1, 2] },
    46: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [2, 2] },
    47: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [3, 2] },
    48: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [0, 3] },
    49: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [1, 3] },
    50: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [2, 3] },
    51: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Pressed, coord: [3, 3] },
  },

  // regular pad released
  128: {
    36: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [0, 0] },
    37: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [1, 0] },
    38: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [2, 0] },
    39: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [3, 0] },
    40: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [0, 1] },
    41: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [1, 1] },
    42: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [2, 1] },
    43: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [3, 1] },
    44: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [0, 2] },
    45: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [1, 2] },
    46: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [2, 2] },
    47: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [3, 2] },
    48: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [0, 3] },
    49: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [1, 3] },
    50: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [2, 3] },
    51: { type: BUTTON_TYPE.Pad, state: BUTTON_STATE.Unpressed, coord: [3, 3] },
  },

  // K buttons and Pad Bank pressed
  191: {
    1: {
      1: { type: BUTTON_TYPE.PadBank, index: 0 },
      2: { type: BUTTON_TYPE.PadBank, index: 1 },
      3: { type: BUTTON_TYPE.PadBank, index: 2 },
      4: { type: BUTTON_TYPE.PadBank, index: 3 },
    },
    2: {
      1: { type: BUTTON_TYPE.KButton, index: 0 },
      2: { type: BUTTON_TYPE.KButton, index: 1 },
      3: { type: BUTTON_TYPE.KButton, index: 2 },
      4: { type: BUTTON_TYPE.KButton, index: 3 },
    }
  },

  // wheel turned or accelerometer (bumper) buttons held and active
  176: {
    4: (velocity) => {
      if (velocity === 1) {
        return { type: BUTTON_TYPE.Wheel, direction: WHEEL_DIRECTION.Clockwise };
      }

      return { type: BUTTON_TYPE.Wheel, direction: WHEEL_DIRECTION.CounterClockwise };
    },
    9: (velocity) => ({
      type: BUTTON_TYPE.Accelerometer,
      axis: ACCELEROMETER_AXIS.Horizontal,
      direction: velocity < 64 ? ACCELEROMETER_DIRECTION.Left : ACCELEROMETER_DIRECTION.Right,
      velocity: Math.abs(velocity - 63),
    }),
    10: (velocity) => ({
      type: BUTTON_TYPE.Accelerometer,
      axis: ACCELEROMETER_AXIS.Vertical,
      direction: velocity < 64 ? ACCELEROMETER_DIRECTION.Backward : ACCELEROMETER_DIRECTION.Forward,
      velocity: Math.abs(velocity - 63),
    }),
  },

  // accelerometer (bumper) button pressed
  159: {
    3: { type: BUTTON_TYPE.Bumper, axis: ACCELEROMETER_AXIS.Horizontal, state: BUTTON_STATE.Pressed },
    4: { type: BUTTON_TYPE.Bumper, axis: ACCELEROMETER_AXIS.Vertical, state: BUTTON_STATE.Pressed },
  },

  // accelerometer (bumper) button released
  143: {
    3: { type: BUTTON_TYPE.Bumper, axis: ACCELEROMETER_AXIS.Horizontal, state: BUTTON_STATE.Unpressed },
    4: { type: BUTTON_TYPE.Bumper, axis: ACCELEROMETER_AXIS.Vertical, state: BUTTON_STATE.Unpressed },
  },
}

export function getButtonFromMidiMessage(midiMsg) {
  const [ command, note, velocity ] = midiMsg;

  switch (command) {
    // regular pad pressed
    case 144:
    case 128:
    case 159:
    case 143: {
      return BUTTONS[command][note];
    }

    // K buttons and Pad Bank pressed
    case 191: {
      return BUTTONS[command][note][velocity];
    }

    // wheel turned or accelerometer (bumper) buttons held and active
    case 176: {
      return BUTTONS[command][note](velocity);
    }
  }
}
