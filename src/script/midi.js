export async function initialize(inputCb) {
  if (navigator.requestMIDIAccess) {
    return navigator.requestMIDIAccess().then(({ inputs, outputs }) => {
      console.log('MIDI access granted');

      if (!inputs.size || !outputs.size) {
        throw new Error('Missing MIDI input or output device');
      }

      const input = inputs.values().next().value;

      if (inputCb) {
        input.onmidimessage = inputCb;
      }

      // TODO: work with multiple MIDI devices attached
      return {
        input,
        output: outputs.values().next().value,
      };
    });
  }
  else {
    // TODO: use polyfill
    throw new Error('No MIDI support in your browser.');
  }
}
