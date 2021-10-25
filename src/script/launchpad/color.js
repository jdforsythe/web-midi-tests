export const BRIGHTNESS = {
  Off: 0,
  Low: 1,
  Medium: 2,
  High: 3,
};

export const COLORS = {
  Red: 0,
  Green: 1,
  Amber: 2,
  Yellow: 3,
}

const LED_VALUES = {
  [COLORS.Red]: (brightness) => ({ red: brightness, green: 0 }),
  [COLORS.Green]: (brightness) => ({ red: 0, green: brightness }),
  [COLORS.Amber]: (brightness) => ({ red: brightness, green: brightness }),
  [COLORS.Yellow]: (brightness) => brightness ? ({ red: 2, green: 3 }) : { red: 0, green: 0 },
}

export function getColorMidiCode(brightness, color) {
  const { red, green } = LED_VALUES[color](brightness);

  return (
    0b10000 * green +
    0b01000 * 0 + // clear bit
    0b00100 * 0 + // copy bit
    0b00001 * red
  );
}

export function getBrightnessMidiCode(brightness) {
  return brightness > 0 && brightness <= 3 ? brightness + 0x7c : 0;
}
