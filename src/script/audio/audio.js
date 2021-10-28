const context = new AudioContext();

let oscillators = {};

const masterGain = context.createGain();
masterGain.connect(context.destination);

const analyzer = context.createAnalyser();
masterGain.connect(analyzer);
analyzer.fftSize = 512;

let waveform = new Uint8Array(analyzer.frequencyBinCount);

const song = {
  song: new Audio('//zacharydenton.github.io/noisehack/static/zero_centre.mp3'),
  playing: false,
};

song.song.crossOrigin = 'anonymous';

const songSource = context.createMediaElementSource(song);
songSource.connect(masterGain);

song = { song, playing: false };


function getOscillator() {
  const osc = context.createOscillator();
  osc.connect(context.destination);

  return osc;
}

function getFrequencyFromNoteNumber(num) {
  return Math.pow(2, (num - 69) / 12) * 440;
}

export function noteOn(midiNote) {
  const frequency = getFrequencyFromNoteNumber(midiNote);

  console.log(`playing ${frequency}`);

  if (oscillators[midiNote]) {
    return;
  }

  const oscillator = getOscillator();

  oscillator.frequency.setTargetAtTime(frequency, context.currentTime, 0);

  oscillator.start(0);
  oscillators[midiNote] = oscillator;
}

export function noteOff(midiNote) {
  const frequency = getFrequencyFromNoteNumber(midiNote);

  console.log(`stopping ${frequency}`);

  if (!oscillators[midiNote]) {
    return;
  }

  oscillators[midiNote].stop(0);
  oscillators[midiNote] = undefined;
}

export function getSong() {
  if (!song) {

  }

  return song;
}

export function playSong() {
  getSong().song.play();
  getSong().playing = true;
}

export function pauseSong() {
  getSong().song.pause();
  getSong().playing = false;
}

export function startWaveformAnalysis() {
  requestAnimationFrame(startWaveformAnalysis);
  analyzer.getByteFrequencyData(waveform);
}
