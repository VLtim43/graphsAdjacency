export const Colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    // Existing colors
    pink: "\x1b[35m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    lavender: "\x1b[38;5;183m",
    beige: "\x1b[38;5;230m",
    lightPink: "\x1b[38;5;211m",
    darkMagenta: "\x1b[38;5;127m",
    lightLavender: "\x1b[38;5;189m",
    // Additional shades of green
    lightGreen: "\x1b[38;5;120m", // A brighter, lighter green
    darkGreen: "\x1b[38;5;22m", // A darker, more subdued green
    oliveGreen: "\x1b[38;5;58m", // A darker, yellowish-green, resembling olive
    neonGreen: "\x1b[38;5;82m", // A vibrant, almost neon green
    seaGreen: "\x1b[38;5;85m", // A green with a slight hint of blue, reminiscent of sea green

    brightOrange: "\x1b[38;5;214m", // A bright, vivid orange
    darkOrange: "\x1b[38;5;202m", // A darker, more muted orange
    pastelOrange: "\x1b[38;5;216m", // A softer, pastel-like orange
    goldOrange: "\x1b[38;5;220m", // A golden orange, with a yellowish tint
  },

  bg: {
    pink: "\x1b[45m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    red: "\x1b[41m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    lavender: "\x1b[48;5;183m",
    beige: "\x1b[48;5;230m",
    lightPink: "\x1b[48;5;211m",
    darkMagenta: "\x1b[48;5;127m",
    lightLavender: "\x1b[48;5;189m",
  },
};

export const colorText = (text, colorCode) => {
  return `${colorCode}${text}\x1b[0m`;
};

function logAllColors() {
  const sampleText = "Sample Text";
  console.log("Foreground colors:");
  Object.keys(Colors.fg).forEach((color) => {
    const coloredText = colorText(sampleText, Colors.fg[color]);
    console.log(coloredText + " " + color);
  });

  console.log("\nBackground colors:");
  Object.keys(Colors.bg).forEach((color) => {
    const coloredText = colorText(sampleText, Colors.bg[color]);
    console.log(coloredText + " " + color);
  });
}

// logAllColors();
