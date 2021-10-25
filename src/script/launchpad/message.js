export async function displayMessage(launchPadOutput, message, color) {
  const colors = [
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
    [[color], [color], [color], [color], [color], [color], [color], [color]],
  ];

  const messageArray = message.split('');
  messageArray.push('OFF');

  let retn = Promise.resolve();

  for (const letter of messageArray) {
    retn = retn.then(() => new Promise((resolve) => setTimeout(resolve, 500)))
      .then(() => launchPadOutput.displayLetter(letter, colors));
  }

  return retn;
}
