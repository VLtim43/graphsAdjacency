import { createInterface } from "readline";
import { Graph } from "./graph.mjs";
import { Colors } from "./colors.mjs";

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
        `Invalid input. Please enter a letter between [A] and [${String.fromCharCode(
          64 + size
        )}].`
      );
    }
  } while (nodeIndex === -1);
  return nodeIndex;
}

console.log("┌───────────────────────────┐");
console.log("│  Graph Console Interface  │");
console.log("└───────────────────────────┘");

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
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
        console.log("[Link created]");
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
        console.log("[Link deleted]");
      },
    },
    {
      description: "Display the matrix",
      action: () => {
        grafo.displayMatrixAsTable();
      },
    },
    {
      description: "Display as adjacency list",
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
        grafo.neighbourhood(givenNode);
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
      grafo.displayMatrixAsTable();
    },
  });

  do {
    console.log("➜ Choose an option ↴");
    options.forEach((option, index) =>
      console.log(`[${index + 1}] ${option.description}`)
    );
    console.log(`[${options.length + 1}] Exit`);

    const optionIndex = await askQuestion("|");
    const selectedOption = options[optionIndex - 1];

    if (optionIndex == options.length + 1) {
      exit = true;
    } else if (selectedOption) {
      await selectedOption.action();
    } else {
      console.log("Invalid option, please choose again.");
    }
  } while (!exit);
}

async function getNumberOfNodes() {
  const maxValue = 15;
  let num;
  do {
    num = await askQuestion(
      `➜ Enter the number of nodes for the graph [1-${maxValue}]: `
    );
    num = parseInt(num, 10);
  } while (isNaN(num) || num < 1 || num > maxValue);
  return num;
}

async function getGraphOrientation() {
  let type;
  do {
    type = await askQuestion(
      "➜ Choose the graph orientation - [Directed (D) or Undirected (U)]: "
    );
    type = type.toUpperCase();
  } while (type !== "D" && type !== "U");
  return type;
}

async function main() {
  const numberOfNodes = await getNumberOfNodes();
  const orientation = await getGraphOrientation();
  const grafo = new Graph(numberOfNodes, orientation);
  await manageGraphOptions(grafo);
  rl.close();
}

main().catch(console.error);
