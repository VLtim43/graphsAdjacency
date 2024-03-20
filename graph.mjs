const GraphOrientation = {
  DIRECTED: "directed",
  UNDIRECTED: "undirected",
};

export class Graph {
  constructor(size, orientation) {
    this.size = size;
    this.matrix = this.#initiateMatrix(size);
    this.orientation =
      GraphOrientation[orientation] || GraphOrientation.UNDIRECTED;
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
    if (this.orientation === GraphOrientation.UNDIRECTED) {
      this.matrix[nodeB][nodeA] = numberOfLinks;
    }
  }

  removeNode(nodeA, nodeB) {
    this.matrix[nodeA][nodeB] = 0;
  }

  neighbourhood(node) {
    let connectedNodes = [];

    if (this.orientation === GraphOrientation.UNDIRECTED) {
      console.log("test");
    }

    return [];
  }

  shuffle() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.matrix[i][j] = Math.round(Math.random());
      }
    }
  }

  displayMatrixAsTable() {
    const symbol = this.orientation === GraphOrientation.DIRECTED ? "→" : "○";
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
}
