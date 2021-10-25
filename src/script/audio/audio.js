let _context;
let _oscillators = {};
let _masterGain;
let _analyzer;
let _waveform;
let _song;

function getContext() {
  if (!_context) {
    _context = new AudioContext();
  }

  return _context;
}

function getOscillator() {
  _context = getContext();

  const osc = _context.createOscillator();
  osc.connect(_context.destination);

  return osc;
}

function getFrequencyFromNoteNumber(num) {
  return Math.pow(2, (num - 69) / 12) * 440;
}

export function noteOn(midiNote) {
  const frequency = getFrequencyFromNoteNumber(midiNote);

  console.log(`playing ${frequency}`);

  if (_oscillators[midiNote]) {
    return;
  }

  const context = getContext();
  const oscillator = getOscillator();

  oscillator.frequency.setTargetAtTime(frequency, context.currentTime, 0);

  oscillator.start(0);
  _oscillators[midiNote] = oscillator;
}

export function noteOff(midiNote) {
  const frequency = getFrequencyFromNoteNumber(midiNote);

  console.log(`stopping ${frequency}`);

  if (!_oscillators[midiNote]) {
    return;
  }

  _oscillators[midiNote].stop(0);
  _oscillators[midiNote] = undefined;
}

function getMasterGain() {
  if (!_masterGain) {
    _masterGain = getContext().createGain();
    _masterGain.connect(getContext().destination);
  }

  return _masterGain;
}

function getAnalyzer() {
  if (!_analyzer) {
    _analyzer = getContext().createAnalyser();
    getMasterGain().connect(_analyzer);
  }

  return _analyzer;
}

export function getSong() {
  if (!_song) {
    const song = new Audio('//zacharydenton.github.io/noisehack/static/zero_centre.mp3');
    song.crossOrigin = 'anonymous';
    const songSource = getContext().createMediaElementSource(song);
    songSource.connect(getMasterGain());

    _song = { song, playing: false };
  }

  return _song;
}

export function playSong() {
  getSong().song.play();
  getSong().playing = true;
}

export function pauseSong() {
  getSong().song.pause();
  getSong().playing = false;
}

export function getWaveform() {
  if (!_waveform) {
    _waveform = new Float32Array(getAnalyzer().frequencyBinCount);
  }

  return _waveform;
}

export function startWaveformAnalysis() {
  requestAnimationFrame(startWaveformAnalysis);
  getAnalyzer().getFloatTimeDomainData(getWaveform())
}
