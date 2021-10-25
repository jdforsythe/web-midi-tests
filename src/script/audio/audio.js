let _context;
let _oscillator;

function getContext() {
  if (!_context) {
    _context = new AudioContext();
  }

  return _context;
}

function getOscillator() {
  if (!_oscillator) {
    _context = getContext();

    const osc = _context.createOscillator();
    osc.connect(_context.destination);

    _oscillator = { osc, started: false };
  }

  return _oscillator;
}

function getFrequencyFromNoteNumber(num) {
  return Math.pow(2, (num - 69) / 12) * 440;
}

export function noteOn(midiNote) {
  const frequency = getFrequencyFromNoteNumber(midiNote);

  console.log(`playing ${frequency}`);

  const context = getContext();
  const oscillator = getOscillator();

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
  getContext().suspend();
}

