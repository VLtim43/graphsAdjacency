import { createInterface } from "readline";
import { Graph } from "./grap.mjs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Graph Console Interface");

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function getNumberOfNodes() {
  let num;
  do {
    num = await askQuestion("Enter the number of nodes for the graph (1-10): ");
    num = parseInt(num, 10);
  } while (isNaN(num) || num < 1 || num > 10);
  return num;
}

// async function getGraphType() {
//   let type;
//   do {
//     type = await askQuestion(
//       "Enter the type of the graph (D for Directed/U for Undirected): "
//     );
//     type = type.toUpperCase();
//   } while (!["D", "U"].includes(type));
//   return type === "D" ? "Directed" : "Undirected";
// }

async function main() {
  const numberOfNodes = await getNumberOfNodes();
  // const graphType = await getGraphType();

  const newGraph = new Graph(numberOfNodes);
  newGraph.displayMatrixAsTable();

  rl.close();
}

main().catch(console.error);
