import { initialize } from '../midi.js';

import { LaunchpadOutput } from '../launchpad/output.js';
import { getButtonFromMidiMessage } from '../launchpad/buttons.js';
import { COLORS } from '../launchpad/color.js';

import { getSong, playSong, pauseSong, getWaveform, noteOff, noteOn, startWaveformAnalysis } from './audio.js';

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
    noteOff(note);
    setTimeout(() => launchPadOutput.setColor(COLORS.Green, [button.x, button.y], 0), 100);
  }
}

function playPause() {
  const song = getSong();

  if (!song.playing) {
    playSong();
    startWaveformAnalysis();

    const scopeCanvas = document.getElementById('oscilloscope');
    scopeCanvas.width = getWaveform().length;
    scopeCanvas.height = 200;

    const ctx = scopeCanvas.getContext('2d');

    function drawOscilloscope() {
      requestAnimationFrame(drawOscilloscope);

      ctx.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height);
      ctx.beginPath();

      const waveform = getWaveform();

      for (let i = 0; i < waveform.length; i++) {
        const x = i;
        const y = (0.5 + waveform[i] / 2) * scopeCanvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        }
        else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    drawOscilloscope();
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
