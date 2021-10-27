export const BUTTON_STATE = {
  Unpressed: 0,
  Pressed: 1,
};

export const BUTTON_DIRECTION = {
  Up: 1,
  Right: 2,
  Down: 3,
  Left: 4,
};

const BUTTONS = {
  36: {
    0: { state: BUTTON_STATE.Unpressed, direction: BUTTON_DIRECTION.Right },
    127: { state: BUTTON_STATE.Pressed, direction: BUTTON_DIRECTION.Right },
  },
  37: {
    0: { state: BUTTON_STATE.Unpressed, direction: BUTTON_DIRECTION.Up },
    127: { state: BUTTON_STATE.Pressed, direction: BUTTON_DIRECTION.Up },
  },
  38: {
    0: { state: BUTTON_STATE.Unpressed, direction: BUTTON_DIRECTION.Left },
    127: { state: BUTTON_STATE.Pressed, direction: BUTTON_DIRECTION.Left },
  },
  39: {
    0: { state: BUTTON_STATE.Unpressed, direction: BUTTON_DIRECTION.Down },
    127: { state: BUTTON_STATE.Pressed, direction: BUTTON_DIRECTION.Down },
  },
}

export function getButtonFromMidiMessage(midiMsg) {
  const [ command, note, velocity ] = midiMsg;

  return BUTTONS[note][velocity];
}
