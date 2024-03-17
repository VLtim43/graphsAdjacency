import { createInterface } from "readline";
import { Graph } from "./graph.mjs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function manageGraphOptions(grafo) {
  let exit = false;
  do {
    console.log("➜ Choose an option ↴");
    console.log("[1] Create a link between two nodes");
    console.log("[2] Delete a link between two nodes");
    console.log("[3] Shuffle the matrix(random nodes)");
    console.log("[4] Display the matrix");
    console.log("[5] Exit");

    const option = await askQuestion("|");

    switch (option) {
      case "1":
        let nodeA;
        do {
          nodeA = await askQuestion(`➜ Enter the first Node:`);
        } while (isNaN(nodeA) || nodeA < 1 || nodeA > grafo.getSize());

        let nodeB;
        do {
          nodeB = await askQuestion(`➜ Enter the second Node:`);
        } while (isNaN(nodeB) || nodeB < 1 || nodeB > grafo.getSize());

        grafo.linkNodes(parseInt(nodeA, 10), parseInt(nodeB, 10));
        break;

      case "2":
        const nodeAForDeletion = await askQuestion(
          "➜ Enter the source node for deletion: "
        );
        const nodeBForDeletion = await askQuestion(
          "➜ Enter the target node for deletion: "
        );
        grafo.removeNode(
          parseInt(nodeAForDeletion, 10),
          parseInt(nodeBForDeletion, 10)
        );
        console.log("[Link deleted]");
        break;

      case "3":
        grafo.shuffle();
        break;

      case "4":
        grafo.displayMatrixAsTable();
        break;

      case "5":
        exit = true;
        break;
      default:
        console.log("Invalid option, please choose again.");
    }
  } while (!exit);
}

async function main() {
  const numberOfNodes = await getNumberOfNodes();
  const grafo = new Graph(numberOfNodes);
  await manageGraphOptions(grafo);
  rl.close();
}

main().catch(console.error);
