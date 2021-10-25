import { byXy } from './buttons.js';
import { BRIGHTNESS, getBrightnessMidiCode, getColorMidiCode } from './color.js';
import { LETTERS } from './const.js';

export class LaunchpadOutput {
  _midiOutput = undefined;

  constructor(midiOutput) {
    this._midiOutput = midiOutput;

    console.log('Launchpad initialized');
  }

  reset(brightness) {
    this._sendRaw([0xb0, 0x00, getBrightnessMidiCode(brightness)]);
  }

  setColor(color, button, brightness = BRIGHTNESS.High) {
    const [x, y] = button;

    const btn = byXy(x, y);

    if (!btn) {
      return;
    }

    this._sendRaw([btn.cmd, btn.key, getColorMidiCode(brightness, color)]);
  }

  setDisplay(ledMap) {
    for (const row of ledMap) {
      for (const button of row) {
        if (button) {
          this._sendRaw(button);
        }
      }
    }

  }

  getLedMap(onOffMap, colorMap) {
    const ledMap = [];

    for (let i = 0; i < onOffMap.length; i++) {
      const rowOnOff = onOffMap[i];
      const rowColor = colorMap[i];

      const row = [];

      for (let j = 0; j < rowOnOff.length; j++) {
        const buttonOnOff = rowOnOff[j];
        const buttonColor = rowColor[j];
        const btn = byXy(j, i);

        if (!buttonOnOff) {
          row.push(undefined);

          continue;
        }

        row.push([btn.cmd, btn.key, getColorMidiCode(BRIGHTNESS.High, buttonColor)]);

      }

      ledMap.push(row);
    }

    return ledMap;
  }

  displayLetter(letter, colors) {
    this.reset(0);

    const letterToGet = letter === ' ' ? 'OFF' : letter.toUpperCase();;

    const ledMap = this.getLedMap(LETTERS[letterToGet], colors);

    this.setDisplay(ledMap);
  }

  _sendRaw(data) {
    this._midiOutput.send(data);
  }
}
