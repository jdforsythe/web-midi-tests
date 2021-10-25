export const COMMANDS = {
  TopButtons: 0xb0, // 176
  OtherButtons: 0x90, // 144
};

export const BUTTON_STATE = {
  Unpressed: 0,
  Pressed: 1,
};

export const ALL_BUTTONS = (new Array(80)).fill(0)
  .map((_, i) => [i % 9, (i - i % 9) / 9])
  .map(([x, y]) => {
    return {
      cmd: y >= 8 ? COMMANDS.TopButtons : COMMANDS.OtherButtons,
      key: y >= 8 ? 0x68 + x : 0x10 * y + x,
      coords: [x, y],
    };
  });

export const GRID = ALL_BUTTONS.filter((btn) => btn.coords.x < 8 && btn.coords.y < 8);
export const TOP = ALL_BUTTONS.filter((btn) => btn.coords.y === 8);
export const SIDE = ALL_BUTTONS.filter((btn) => btn.coords.x === 8);

export const byXy = (x, y) => ALL_BUTTONS[9 * y + x];

export function getButtonFromMidiMessage(midiMsg) {
  const [ command, note, velocity ] = midiMsg.data;

  const button = { state: velocity === 0 ? BUTTON_STATE.Unpressed : BUTTON_STATE.Pressed };

  if (command === COMMANDS.OtherButtons) {
    button.x = note % 0x10;
    button.y = (note - button.x) / 0x10;
  }
  else {
    button.x = note - 0x68;
    button.y = 8;
  }

  return button;
}
