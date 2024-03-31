export const Colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    pink: "\x1b[31m",
    green: "\x1b[32m",
    orange: "\x1b[33m",
    magenta: "\x1b[34m",
    red: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    lavender: "\x1b[38;5;183m",
    beige: "\x1b[38;5;230m",
  },

  bg: {
    pink: "\x1b[41m",
    green: "\x1b[42m",
    orange: "\x1b[43m",
    magenta: "\x1b[44m",
    red: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",

    lavender: "\x1b[48;5;183m",
    beige: "\x1b[48;5;230m",
  },
};

export const colorText = (text, colorCode) => {
  return `${colorCode}${text}${Colors.reset}`;
};

function logAllForegroundColors() {
  const sampleText = "Sample Text";

  Object.keys(Colors.bg).forEach((color) => {
    const coloredText = colorText(sampleText, Colors.bg[color]);
    console.log(coloredText + " " + color);
  });

  console.log("");

  Object.keys(Colors.fg).forEach((color) => {
    const coloredText = colorText(sampleText, Colors.fg[color]);
    console.log(coloredText + " " + color);
  });
}

logAllForegroundColors();
