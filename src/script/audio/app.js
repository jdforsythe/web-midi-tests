import { initialize } from '../midi.js';

import { LaunchpadOutput } from '../launchpad/output.js';
import { getButtonFromMidiMessage } from '../launchpad/buttons.js';
import { COLORS } from '../launchpad/color.js';

import { noteOff, noteOn } from './audio.js';

let launchPadOutput;

function handleMidiButtonPress(msg) {
  console.log('button pressed');

  const button = getButtonFromMidiMessage(msg);
  const note = msg.data[1];

  if (button.state === 1) {
    noteOn(note);
    launchPadOutput.setColor(COLORS.Green, [button.x, button.y]);
  }
  else {
    noteOff();
    setTimeout(() => launchPadOutput.setColor(COLORS.Green, [button.x, button.y], 0), 100);
  }
}


async function go() {
  const { output } = await initialize(handleMidiButtonPress);
  launchPadOutput = new LaunchpadOutput(output);
  launchPadOutput.reset(0);
}

go().catch(console.error);
