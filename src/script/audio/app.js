import { initialize } from '../midi.js';

import { LaunchpadOutput } from '../launchpad/output.js';
import { getButtonFromMidiMessage } from '../launchpad/buttons.js';
import { COLORS } from '../launchpad/color.js';

import { getSong, playSong, pauseSong, noteOff, noteOn, startWaveformAnalysis } from './audio.js';
import { decreaseXRotation, increaseXRotation, visualize } from './visual.js';

let launchPadOutput;

function handleMidiButtonPress(msg) {
  console.log('button pressed');

  const button = getButtonFromMidiMessage(msg);
  const note = msg.data[1];

  if (msg.data[0] === 0xb0) {
    if (note === 0x68) {
      decreaseXRotation();
      return;
    }
    else if (note === 0x69) {
      increaseXRotation();
      return;
    }
  }

  if (button.state === 1) {
    noteOn(note);
    launchPadOutput.setColor(COLORS.Green, [button.x, button.y]);
  }
  else {
    noteOff(note);
    setTimeout(() => launchPadOutput.setColor(COLORS.Green, [button.x, button.y], 0), 100);
  }
}

function playPause() {
  const song = getSong();

  if (!song.playing) {
    playSong();
    startWaveformAnalysis();

    visualize();
  }
  else {
    pauseSong();
  }
}


async function go() {
  const { output } = await initialize(handleMidiButtonPress);
  launchPadOutput = new LaunchpadOutput(output);
  launchPadOutput.reset(0);

  document.getElementById('play').addEventListener('click', playPause);
}

go().catch(console.error);
