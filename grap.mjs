export class Graph {
  constructor(size) {
    this.size = size;
    this.matrix = this.#initiateMatrix(size);
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
  }

  removeNode(nodeA, nodeB) {
    this.matrix[nodeA][nodeB] = 0;
  }

  displayMatrixAsTable() {
    console.table(this.matrix);
  }
}
