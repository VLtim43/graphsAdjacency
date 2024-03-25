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
    this.matrix[nodeA][nodeB] = numberOfLinks;
    if (this.orientation === "U") {
      this.matrix[nodeB][nodeA] = numberOfLinks;
    }
  }

  removeNode(nodeA, nodeB) {
    this.matrix[nodeA][nodeB] = 0;
  }

  neighbourhood(node) {
    let connectedNodes = [];
    for (let i = 0; i < this.size; i++) {
      if (this.matrix[node][i] > 0) {
        connectedNodes.push(String.fromCharCode(65 + i));
      }
    }

    console.log(connectedNodes);
    return connectedNodes;
  }

  precessorSucessor(node) {}

  shuffle() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.matrix[i][j] = Math.round(Math.random());
      }
    }
  }

  displayMatrixAsTable() {
    const symbol = this.orientation === "D" ? "→" : "○";

    console.log(`[${symbol}]`);

    let labeledMatrix = this.matrix.map((row) => {
      let rowObject = {};
      row.forEach((cell, cellIndex) => {
        const letter = String.fromCharCode(65 + cellIndex);
        rowObject[letter] = cell;
      });
      return rowObject;
    });

    let labeledRows = {};
    labeledMatrix.forEach((row, rowIndex) => {
      const rowLetter = String.fromCharCode(65 + rowIndex);
      labeledRows[rowLetter] = row;
    });

    console.table(labeledRows);
  }

  displayAdjacencyList() {
    console.log("-------------------------------");
    for (let i = 0; i < this.size; i++) {
      let listRepresentation = `[${String.fromCharCode(65 + i)}]`;

      for (let j = 0; j < this.size; j++) {
        if (this.matrix[i][j] > 0) {
          listRepresentation += `→[${String.fromCharCode(65 + j)}]`;
        }
      }

      console.log(listRepresentation);
    }
    console.log("-------------------------------");
  }
}
