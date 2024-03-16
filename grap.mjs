export class Graph {
  constructor(size) {
    this.size = size;
    this.matrix = this.createMatrix(size);
  }

  createMatrix(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = 0;
      }
    }
    return matrix;
  }

  displayMatrixAsTable() {
    console.table(this.matrix);
  }
}

// // Usage example:
// const size = 5; // Define the desired size of the square matrix
// const myMatrix = new Graph(size);
// myMatrix.displayMatrixAsTable(); // Displays the matrix as a table in the console
