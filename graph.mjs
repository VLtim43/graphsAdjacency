import { Colors } from "./colors.mjs";
import { colorText } from "./colors.mjs";

export const indexToLabel = (index) => {
  if (index < 0 || index > 702) {
    throw new Error("Index out of bounds");
  }

  let label = "";
  index += 1;

  while (index > 0) {
    let remainder = index % 26;
    if (remainder === 0) {
      remainder = 26;
    }
    label = String.fromCharCode(64 + remainder) + label;
    index = (index - remainder) / 26;
  }

  return label;
};

export const letterToIndex = (label) => {
  let index = 0;
  for (let i = 0; i < label.length; i++) {
    index = index * 26 + (label.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }
  return index - 1;
};

export class Graph {
  constructor(size, orientation) {
    this.size = size;
    this.matrix = this.#initiateMatrix(size);
    this.orientation = orientation;
  }

  getSize() {
    return this.size;
  }

  getOrientation() {
    return this.orientation;
  }

  #initiateMatrix(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = 0;
      }
    }
    return matrix;
  }

  linkNodes(nodeA, nodeB, numberOfLinks = 1) {
    if (nodeA < 0 || nodeA >= this.size || nodeB < 0 || nodeB >= this.size) {
      console.log(
        colorText(
          "Error: One or both of the nodes do not exist.",
          Colors.fg.red
        )
      );
      return;
    }
    this.matrix[nodeA][nodeB] = numberOfLinks;
    if (this.orientation === "U") {
      this.matrix[nodeB][nodeA] = numberOfLinks;
    }

    console.log(
      colorText(
        `[${indexToLabel(nodeA)}]${
          this.orientation === "U" ? "↔" : "→"
        }[${indexToLabel(nodeB)}] created`,
        Colors.fg.seaGreen
      )
    );
  }

  removeNode(nodeA, nodeB) {
    if (nodeA < 0 || nodeA >= this.size || nodeB < 0 || nodeB >= this.size) {
      console.log(
        colorText(
          "Error: One or both of the nodes do not exist.",
          Colors.fg.red
        )
      );
      return;
    }

    if (this.matrix[nodeA][nodeB] === 0) {
      console.log(
        colorText(
          `No link between [${indexToLabel(nodeA)}] and [${indexToLabel(
            nodeB
          )}] found`,
          Colors.fg.goldOrange
        )
      );
      return;
    }
    this.matrix[nodeA][nodeB] = 0;

    if (this.orientation === "U") {
      this.matrix[nodeB][nodeA] = 0;
    }

    console.log(
      colorText(
        `[${indexToLabel(nodeA)}]${
          this.orientation === "U" ? "↔" : "→"
        }[${indexToLabel(nodeB)}] deleted`,
        Colors.fg.darkOrange
      )
    );
  }

  neighbourhood(node) {
    let connectedNodes = [];
    for (let i = 0; i < this.size; i++) {
      if (this.matrix[node][i] > 0) {
        connectedNodes.push(indexToLabel(i));
      }
    }

    console.log(
      colorText(
        `Nodes in the neighbourhood of [${indexToLabel(node)}]: ` +
          connectedNodes,
        Colors.fg.beige
      )
    );
  }

  predecessorSuccessor(node) {
    if (this.orientation !== "D") {
      console.log(
        colorText(
          "Error: Operation not valid for this type of graph",
          Colors.fg.red
        )
      );
      return;
    }

    let predecessors = [];
    let successors = [];

    for (let i = 0; i < this.size; i++) {
      if (this.matrix[node][i] > 0) {
        successors.push(indexToLabel(i));
      }
      if (this.matrix[i][node] > 0) {
        predecessors.push(indexToLabel(i));
      }
    }

    console.log(
      colorText(
        `Sucessors of [${indexToLabel(node)}]: ` + successors,
        Colors.fg.beige
      )
    );

    console.log(
      colorText(
        `Predecessors of [${indexToLabel(node)}]: ` + predecessors,
        Colors.fg.beige
      )
    );
  }

  nodeDegree(node) {
    if (node < 0 || node >= this.size) {
      console.log(colorText("Error: The node does not exist.", Colors.fg.red));
      return;
    }

    let degree = 0;

    for (let i = 0; i < this.size; i++) {
      if (this.matrix[node][i] > 0) {
        degree++;
      }
    }

    if (this.orientation === "D") {
      for (let i = 0; i < this.size; i++) {
        if (this.matrix[i][node] > 0 && i !== node) {
          degree++;
        }
      }
    }

    console.log(
      colorText(
        `Degree of node [${indexToLabel(node)}]: ${degree}`,
        Colors.fg.seaGreen
      )
    );
  }

  shuffle() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.matrix[i][j] = Math.round(Math.random());
      }
    }
  }

  displayMatrixAsTable() {
    let labeledMatrix = this.matrix.map((row, rowIndex) => {
      let rowObject = {};
      row.forEach((cell, cellIndex) => {
        rowObject[indexToLabel(cellIndex)] = cell;
      });
      return rowObject;
    });

    let labeledRows = {};
    labeledMatrix.forEach((row, rowIndex) => {
      labeledRows[indexToLabel(rowIndex)] = row;
    });

    console.table(labeledRows);
  }

  displayAdjacencyList() {
    for (let i = 0; i < this.size; i++) {
      let listRepresentation = colorText(
        `[${indexToLabel(i)}]`,
        Colors.fg.seaGreen
      );

      for (let j = 0; j < this.size; j++) {
        if (this.matrix[i][j] > 0) {
          listRepresentation += colorText(
            `→[${indexToLabel(j)}]`,
            Colors.fg.beige
          );
        }
      }

      console.log(colorText("║ ", Colors.fg.cyan) + listRepresentation);
    }
  }

  // simple = no loops & multi edges
  checkSimpleGraph() {
    for (let i = 0; i < this.size; i++) {
      if (this.matrix[i][i] !== 0) {
        console.log(
          colorText("[x] Graph is not simple: found a loop", Colors.fg.red)
        );
        return false;
      }
    }
    console.log(colorText("[✓] Graph is simple", Colors.fg.seaGreen));
    return true;
  }

  // regular = all nodes have the same number of links
  checkRegularGraph() {
    let degree = this.matrix[0].reduce((acc, val) => acc + val, 0);
    for (let i = 1; i < this.size; i++) {
      let currentDegree = this.matrix[i].reduce((acc, val) => acc + val, 0);
      if (currentDegree !== degree) {
        console.log(colorText("[x] Graph is not regular", Colors.fg.red));
        return false;
      }
    }
    console.log(colorText("[✓] Graph is regular", Colors.fg.seaGreen));
    return true;
  }

  // complete = all nodes are connected, excluding loops
  checkCompleteGraph() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (i === j) continue;
        if (this.matrix[i][j] !== 1) {
          console.log(colorText("[x] Graph is not complete", Colors.fg.red));
          return false;
        }
      }
    }
    console.log(colorText("[✓] Graph is complete", Colors.fg.seaGreen));
    return true;
  }

  // bipartite = split in two sets
  checkBipartiteGraph() {
    let colors = Array(this.size).fill(-1);
    for (let start = 0; start < this.size; start++) {
      if (colors[start] === -1) {
        let queue = [start];
        colors[start] = 0;
        while (queue.length) {
          let vertex = queue.shift();
          for (let i = 0; i < this.size; i++) {
            if (this.matrix[vertex][i] !== 0 && colors[i] === -1) {
              colors[i] = 1 - colors[vertex];
              queue.push(i);
            } else if (
              this.matrix[vertex][i] !== 0 &&
              colors[i] === colors[vertex]
            ) {
              console.log(
                colorText("[x] Graph is not bipartite", Colors.fg.red)
              );
              return false;
            }
          }
        }
      }
    }
    console.log(colorText("[✓] Graph is bipartite", Colors.fg.seaGreen));
    return true;
  }
}
