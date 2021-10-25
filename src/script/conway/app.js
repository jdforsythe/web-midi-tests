import { LaunchpadOutput } from '../launchpad/output.js';
import { Game } from './conway.js';
import { getButtonFromMidiMessage } from '../launchpad/buttons.js';
import { initialize } from '../midi.js';



window.setup = function setup() {
  return initialize(handleMidiButtonPress).then(({ output }) => {
    const launchPadOutput = new LaunchpadOutput(output);
    game = new Game(launchPadOutput);
  });
};

window.draw = function draw() {
  if (!game) {
    return;
  }

  frameRate(1);

  console.log('drawing');

  game.draw();
}

window.keyPressed = function keyPressed() {
  if (keyCode === 32) {
    game.reset();
  }
};

function handleMidiButtonPress(msg) {
  const button = getButtonFromMidiMessage(msg);

  if (button.state === 1) {
    return;
  }

  if (button.x === 8 && button.y === 0) {
    return game.reset();
  }
}
