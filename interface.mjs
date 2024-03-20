import { createInterface } from "readline";
import { Graph } from "./graph.mjs";

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

async function getNumberOfNodes() {
  const maxValue = 15;
  let num;
  do {
    num = await askQuestion(
      `➜ Enter the number of nodes for the graph (1-${maxValue}): `
    );
    num = parseInt(num, 10);
  } while (isNaN(num) || num < 1 || num > maxValue);
  return num;
}

async function getGraphType() {
  let type;
  do {
    type = await askQuestion(
      "➜ Choose the graph orientation - [Directed (D) or Undirected (U)]: "
    );
    type = type.toUpperCase();
  } while (type !== "D" && type !== "U");
  return type === "D" ? "directed" : "undirected";
}

async function manageGraphOptions(grafo) {
  let exit = false;
  let orientation = grafo.getOrientation();
  do {
    console.log("➜ Choose an option ↴");
    console.log("[1] Create a link between two nodes");
    console.log("[2] Delete a link between two nodes");
    console.log("[3] Shuffle the matrix(random nodes)");
    console.log("[4] Display the matrix");

    if (orientation === "directed") {
      console.log("[5] Identify successor/predecessor for given Node");
    }

    if (orientation === "undirected") {
      console.log("[5] Identify neighbourhood for given Node");
    }

    console.log("[6] Exit");

    const option = await askQuestion("|");

    switch (option) {
      case "1":
      case "1":
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
        break;

      case "2":
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
        break;

      case "3":
        grafo.shuffle();
        grafo.displayMatrixAsTable();
        break;

      case "4":
        grafo.displayMatrixAsTable();
        break;

      case "5":
        break;

      case "6":
        exit = true;
        break;
      default:
        console.log("Invalid option, please choose again.");
    }
  } while (!exit);
}

async function main() {
  const numberOfNodes = await getNumberOfNodes();
  const orientation = await getGraphType();
  const grafo = new Graph(numberOfNodes, orientation);
  await manageGraphOptions(grafo);
  rl.close();
}

main().catch(console.error);
