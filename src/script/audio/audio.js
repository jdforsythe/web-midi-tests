let context;
let oscillators = {};
let _song;
let analyzer;
let waveform;

export function getSong() {
  if (!_song) {
    context = new AudioContext();

    const masterGain = context.createGain();
    masterGain.connect(context.destination);
    
    analyzer = context.createAnalyser();
    masterGain.connect(analyzer);
    analyzer.fftSize = 512;
    
    waveform = new Uint8Array(analyzer.frequencyBinCount);
    
    _song = {
      song: new Audio('//files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Shaolin_Dub/The_Urban_Chronicle/Shaolin_Dub_-_01_-_Concrete_Worries.mp3'),
      playing: false,
    };
    
    _song.song.crossOrigin = 'anonymous';
    
    const songSource = context.createMediaElementSource(_song.song);
    songSource.connect(masterGain);
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
  return waveform;
}

export function startWaveformAnalysis() {
  requestAnimationFrame(startWaveformAnalysis);
  analyzer.getByteFrequencyData(waveform);
}
