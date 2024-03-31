import { createInterface } from "readline";
import { Graph } from "./graph.mjs";
import { Colors } from "./colors.mjs";
import { colorText } from "./colors.mjs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function letterToIndex(letter, size) {
  const index = letter.charCodeAt(0) - 65;
  return index >= 0 && index < size ? index : -1;
}

async function getNodeInput(promptMessage, size) {
  let nodeLetter, nodeIndex;
  do {
    nodeLetter = (await askQuestion(promptMessage)).toUpperCase();
    nodeIndex = letterToIndex(nodeLetter, size);
    if (nodeIndex === -1) {
      console.log(
        colorText(
          `Invalid input. Please enter a letter between [A] and [${String.fromCharCode(
            64 + size
          )}].`,
          Colors.fg.red
        )
      );
    }
  } while (nodeIndex === -1);
  return nodeIndex;
}

console.log(colorText("╔═════════════════════════════╗", Colors.fg.lavender));
console.log(colorText("║   Graph Console Interface   ║", Colors.fg.lavender));
console.log(colorText("╚═════════════════════════════╝ ", Colors.fg.lavender));

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(colorText(query, Colors.fg.white), (answer) => {
      resolve(answer);
    });
  });
}

async function getNumberOfNodes() {
  const maxValue = 15;
  let num;
  do {
    let input = await askQuestion(
      colorText(
        `[➜] Enter the number of nodes for the graph «1-${maxValue}»: `,
        Colors.fg.lavender
      )
    );
    num = parseInt(input, 10);

    if (
      !Number.isInteger(num) ||
      num < 1 ||
      num > maxValue ||
      num.toString() !== input.trim()
    ) {
      console.log(
        colorText(
          "Error: Number is out of bounds or is not a valid number",
          Colors.fg.white,
          Colors.bg.red
        )
      );
      num = undefined;
    }
  } while (num === undefined);
  return num;
}

async function getGraphOrientation() {
  let type;
  do {
    type = await askQuestion(
      colorText(
        "[➜] Choose the graph orientation «Directed[D]/Undirected[U]»: ",
        Colors.fg.lavender
      )
    );
    type = type.toUpperCase();
    if (type !== "D" && type !== "U") {
      console.log(colorText("Error: Invalid option", Colors.fg.red));
    }
  } while (type !== "D" && type !== "U");
  console.log(
    type === "D"
      ? colorText("[Directed Graph →]", Colors.fg.beige)
      : colorText("[Undirected Graph ○]", Colors.fg.beige)
  );
  return type;
}

async function manageGraphOptions(grafo) {
  let exit = false;
  let orientation = grafo.getOrientation();

  const options = [
    {
      description: "Create a link between two nodes",
      action: async () => {
        const nodeAIndex = await getNodeInput(
          `➜ Enter the first Node:`,
          grafo.getSize()
        );
        const nodeBIndex = await getNodeInput(
          `➜ Enter the second Node:`,
          grafo.getSize()
        );
        grafo.linkNodes(nodeAIndex, nodeBIndex);
        console.log(
          `[${String.fromCharCode(65 + nodeAIndex)}]→[${String.fromCharCode(
            65 + nodeBIndex
          )}] created`
        );
      },
    },
    {
      description: "Delete a link between two nodes",
      action: async () => {
        const nodeAForDeletionIndex = await getNodeInput(
          "➜ Enter the source node for deletion: ",
          grafo.getSize()
        );
        const nodeBForDeletionIndex = await getNodeInput(
          "➜ Enter the target node for deletion: ",
          grafo.getSize()
        );
        grafo.removeNode(nodeAForDeletionIndex, nodeBForDeletionIndex);
        console.log(
          `[${String.fromCharCode(
            65 + nodeAForDeletionIndex
          )}]→[${String.fromCharCode(65 + nodeBForDeletionIndex)}] deleted`
        );
      },
    },
    {
      description: "Display as Adjacency Matrix",
      action: () => {
        grafo.displayMatrixAsTable();
      },
    },
    {
      description: "Display as Adjacency list",
      action: () => {
        grafo.displayAdjacencyList();
      },
    },
  ];

  if (orientation === "D") {
    options.push({
      description: "Identify successor/predecessor for given Node",
      action: async () => {
        const givenNode = await getNodeInput(
          "➜ Enter the Node: ",
          grafo.getSize()
        );
        grafo.predecessorSuccessor(givenNode);
      },
    });
  }

  if (orientation === "U") {
    options.push({
      description: "Identify neighbourhood for given Node",
      action: async () => {
        const givenNode = await getNodeInput(
          "➜ Enter the Node: ",
          grafo.getSize()
        );
        grafo.neighbourhood(givenNode);
      },
    });
  }

  options.push({
    description: "Shuffle the matrix (random nodes)",
    action: () => {
      grafo.shuffle();
      console.log("[Matrix shuffled]");
      // grafo.displayAdjacencyList();
    },
  });

  do {
    console.log(colorText("[➜] Choose an option ↴", Colors.fg.pink));

    console.log("┌────────────────────────────────────────────────────────┐");
    options.forEach((option, index) =>
      console.log(`│ [${index + 1}] ${option.description}`)
    );
    console.log(`│ [${options.length + 1}] Exit`);
    console.log("└────────────────────────────────────────────────────────┘");

    const optionIndex = await askQuestion("> ");
    const selectedOption = options[optionIndex - 1];

    if (optionIndex == options.length + 1) {
      exit = true;
    } else if (selectedOption) {
      await selectedOption.action();
    } else {
      console.log(colorText("Error: Invalid option", Colors.fg.red));
    }
  } while (!exit);
}

async function main() {
  const numberOfNodes = await getNumberOfNodes();
  const orientation = await getGraphOrientation();
  const grafo = new Graph(numberOfNodes, orientation);
  await manageGraphOptions(grafo);
  rl.close();
}

main().catch(console.error);
