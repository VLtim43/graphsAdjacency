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
        Colors.fg.cyan
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
          Colors.fg.yellow
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
        Colors.fg.cyan
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

    console.log(connectedNodes);
    return connectedNodes;
  }

  predecessorSuccessor(node) {
    if (this.orientation !== "D") {
      console.log("This operation is only valid for directed graphs.");
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

    console.log(`Predecessors of [${indexToLabel(node)}]: `, predecessors);
    console.log(`Successors of [${indexToLabel(node)}]: `, successors);
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
        Colors.fg.green
      );

      for (let j = 0; j < this.size; j++) {
        if (this.matrix[i][j] > 0) {
          listRepresentation += `→[${indexToLabel(j)}]`;
        }
      }

      console.log(listRepresentation);
    }
  }
}
