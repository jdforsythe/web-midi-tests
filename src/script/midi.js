export async function initialize() {
  if (navigator.requestMIDIAccess) {
    return navigator.requestMIDIAccess().then(({ inputs, outputs }) => {
      console.log('MIDI access granted');

      if (!inputs.size || !outputs.size) {
        throw new Error('Missing MIDI input or output device');
      }

      const ins = Array.from(inputs.values());
      const outs = Array.from(outputs.values());

      return { inputs: ins, outputs: outs };
    });
  }
  else {
    // TODO: use polyfill
    throw new Error('No MIDI support in your browser.');
  }
}
