import { createInterface } from "readline";
import { Graph, indexToLabel, letterToIndex } from "./graph.mjs";
import { Colors } from "./colors.mjs";
import { colorText } from "./colors.mjs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getNodeInput(promptMessage, size) {
  let nodeLabel, nodeIndex;
  do {
    nodeLabel = (await askQuestion(promptMessage)).toUpperCase();
    nodeIndex = letterToIndex(nodeLabel);
    if (nodeIndex < 0 || nodeIndex >= size) {
      console.log(
        colorText(
          `Error: Invalid input. Please enter a label between [A] and [${indexToLabel(
            size - 1
          )}].`,
          Colors.bg.red
        )
      );
    }
  } while (nodeIndex < 0 || nodeIndex >= size);
  return nodeIndex;
}

console.log(
  colorText("╔═════════════════════════════╗", Colors.fg.lightLavender)
);
console.log(
  colorText("║   Graph Console Interface   ║", Colors.fg.lightLavender)
);
console.log(
  colorText("╚═════════════════════════════╝ ", Colors.fg.lightLavender)
);

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(colorText(query, Colors.fg.white), (answer) => {
      resolve(answer);
    });
  });
}

async function getNumberOfNodes() {
  const maxValue = 25; //the max is 702 nodes. From [A] to [ZZ]. No guarantee to handle the table/list display inside a terminal window without breaking the layout
  let num;
  do {
    let input = await askQuestion(
      colorText(
        `[➜] Enter the number of nodes for the graph «1-${maxValue}»: `,
        Colors.fg.lightLavender
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
        Colors.fg.lightLavender
      )
    );
    type = type.toUpperCase();
    if (type !== "D" && type !== "U") {
      console.log(colorText("Error: Invalid option", Colors.bg.red));
    }
  } while (type !== "D" && type !== "U");
  console.log(
    type === "D"
      ? colorText("[Directed Graph →]", Colors.fg.cyan)
      : colorText("[Undirected Graph ○]", Colors.fg.cyan)
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
          colorText(`[➜] Enter the first Node: `, Colors.fg.lightLavender),
          grafo.getSize()
        );
        const nodeBIndex = await getNodeInput(
          colorText(`[➜] Enter the second Node: `, Colors.fg.lightLavender),
          grafo.getSize()
        );
        grafo.linkNodes(nodeAIndex, nodeBIndex);
      },
    },
    {
      description: "Delete a link between two nodes",
      action: async () => {
        const nodeAForDeletionIndex = await getNodeInput(
          colorText(`[➜] Enter the first Node: `, Colors.fg.lightLavender),
          grafo.getSize()
        );
        const nodeBForDeletionIndex = await getNodeInput(
          colorText(`[➜] Enter the second Node: `, Colors.fg.lightLavender),
          grafo.getSize()
        );
        grafo.removeNode(nodeAForDeletionIndex, nodeBForDeletionIndex);
      },
    },
    {
      description: "Display as Matrix",
      action: () => {
        console.log(
          colorText(
            "╔══════════════════════════════════════════════════════════════",
            Colors.fg.cyan
          )
        );
        grafo.displayMatrixAsTable();
        console.log(
          colorText(
            "╚══════════════════════════════════════════════════════════════",
            Colors.fg.cyan
          )
        );
      },
    },
    {
      description: "Display as list",
      action: () => {
        console.log(
          colorText(
            "╔═════════════════════════════════════════════════════════════╗",
            Colors.fg.cyan
          )
        );
        grafo.displayAdjacencyList();
        console.log(
          colorText(
            "╚═════════════════════════════════════════════════════════════╝",
            Colors.fg.cyan
          )
        );
      },
    },

    {
      description: "Identify the degree of a Node",
      action: async () => {
        const node = await getNodeInput(
          colorText(`[➜] Enter the first Node: `, Colors.fg.lightLavender),
          grafo.getSize()
        );

        grafo.nodeDegree(node);
      },
    },

    {
      description: "Check graph characteristics",
      action: async () => {
        console.log(
          colorText("[ Graph characteristics ] ↴", Colors.fg.lightLavender)
        );
        grafo.checkSimpleGraph();
        grafo.checkRegularGraph();
        grafo.checkCompleteGraph();
        grafo.checkBipartiteGraph();
      },
    },
  ];

  if (orientation === "D") {
    options.push({
      description: "Identify successor/predecessor for given Node",
      action: async () => {
        const givenNode = await getNodeInput(
          colorText(`[➜] Enter the Node: `, Colors.fg.lightLavender),
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
          colorText(`[➜] Enter the Node: `, Colors.fg.lightLavender),
          grafo.getSize()
        );
        grafo.neighbourhood(givenNode);
      },
    });
  }

  options.push({
    description: "Shuffle the graph (random nodes)",
    action: () => {
      grafo.shuffle();
      console.log(colorText("[Graph shuffled] ↺", Colors.fg.darkMagenta));
    },
  });

  do {
    console.log(colorText("[➜] Choose an option ↴", Colors.fg.lightLavender));

    console.log(
      colorText(
        "╔═════════════════════════════════════════════════════════════╗",
        Colors.fg.lightLavender
      )
    );
    options.forEach((option, index) =>
      console.log(
        colorText(
          `║ [${index + 1}] ${option.description}`,
          Colors.fg.lightLavender
        )
      )
    );
    console.log(
      colorText(`║ [${options.length + 1}] Exit`, Colors.fg.lightLavender)
    );
    console.log(
      colorText(
        "╚═════════════════════════════════════════════════════════════╝",
        Colors.fg.lightLavender
      )
    );

    const optionIndex = await askQuestion(colorText("[>] ", Colors.fg.cyan));
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
