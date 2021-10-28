const context = new AudioContext();

const oscillator = {
  osc: context.createOscillator(),
  started: false,
};

_oscillator.osc.connect(_context.destination);

function getFrequencyFromNoteNumber(num) {
  return Math.pow(2, (num - 69) / 12) * 440;
}

export function noteOn(midiNote) {
  const frequency = getFrequencyFromNoteNumber(midiNote);

  console.log(`playing ${frequency}`);

  oscillator.osc.frequency.setTargetAtTime(frequency, context.currentTime, 0);

  if (!oscillator.started) {
    oscillator.osc.start(0);
    oscillator.started = true;
  }
  else {
    context.resume();
  }
}

export function noteOff() {
  console.log('stopping');
  context.suspend();
}

