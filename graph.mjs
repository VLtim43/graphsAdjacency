export class Graph {
  constructor(size) {
    this.size = size;
    this.matrix = this.#initiateMatrix(size);
  }

  getSize() {
    return this.size;
  }

  #initiateMatrix(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i + 1] = [];
      for (let j = 0; j < size; j++) {
        matrix[i + 1][j + 1] = 0;
      }
    }
    return matrix;
  }

  linkNodes(nodeA, nodeB, numberOfLinks = 1) {
    this.matrix[nodeA][nodeB] = numberOfLinks;
  }

  removeNode(nodeA, nodeB) {
    this.matrix[nodeA][nodeB] = 0;
  }

  shuffle() {
    for (let i = 1; i < this.size; i++) {
      for (let j = 1; j < this.size; j++) {
        this.matrix[i][j] = Math.round(Math.random());
      }
    }
  }

  displayMatrixAsTable() {
    console.table(this.matrix);
  }
}
