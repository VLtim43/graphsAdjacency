import { Colors } from "./colors.mjs";
import { colorText } from "./colors.mjs";

const MAX_WEIGHT = 15;

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

  setLinkWeight(nodeA, nodeB, weight) {
    if (nodeA < 0 || nodeA >= this.size || nodeB < 0 || nodeB >= this.size) {
      console.log(
        colorText(
          "Error: One or both of the nodes do not exist.",
          Colors.fg.red
        )
      );
      return;
    }
    if (weight < 1 || weight > MAX_WEIGHT) {
      console.log(
        colorText(
          `Error: Weight must be between 1 and ${MAX_WEIGHT}.`,
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
          )}] found to set weight.`,
          Colors.fg.goldOrange
        )
      );
      return;
    }
    this.matrix[nodeA][nodeB] = weight;
    if (this.orientation === "U") {
      this.matrix[nodeB][nodeA] = weight;
    }

    console.log(
      colorText(
        `Weight for link [${indexToLabel(nodeA)}]${
          this.orientation === "U" ? "↔" : "→"
        }[${indexToLabel(nodeB)}] set to ${weight}`,
        Colors.fg.seaGreen
      )
    );
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
          if (this.matrix[i][j] > 1) {
            listRepresentation += colorText(
              `-${this.matrix[i][j]}->[${indexToLabel(j)}]`,
              Colors.fg.beige
            );
          } else {
            listRepresentation += colorText(
              `→[${indexToLabel(j)}]`,
              Colors.fg.beige
            );
          }
        }
      }

      console.log(colorText("║ ", Colors.fg.cyan) + listRepresentation);
    }
  }

  breadthFirstSearch(node) {
    if (node < 0 || node >= this.size) {
      console.log(
        colorText("Error: Starting node does not exist.", Colors.fg.red)
      );
      return;
    }

    let queue = [];
    let visited = Array(this.size).fill(false);
    let path = [];

    queue.push(node);
    visited[node] = true;

    while (queue.length > 0) {
      let currentNode = queue.shift();
      path.push(indexToLabel(currentNode));
      console.log(
        colorText(`Visiting [${indexToLabel(currentNode)}]`, Colors.fg.seaGreen)
      );

      for (let i = 0; i < this.size; i++) {
        if (this.matrix[currentNode][i] !== 0 && !visited[i]) {
          visited[i] = true;
          queue.push(i);
          console.log(
            colorText(`Enqueue [${indexToLabel(i)}]`, Colors.fg.cyan)
          );
        }
      }
    }

    console.log(
      colorText("BFS Complete. Visited nodes in order:", Colors.fg.goldOrange)
    );
    console.log(colorText(path.join(" → "), Colors.fg.seaGreen));
  }

  depthFirstSearch(node) {
    if (node < 0 || node >= this.size) {
      console.log(
        colorText("Error: Starting node does not exist.", Colors.fg.red)
      );
      return;
    }

    let visited = Array(this.size).fill(false);
    let path = [];

    // Helper function for DFS
    const dfs = (currentNode) => {
      visited[currentNode] = true;
      path.push(indexToLabel(currentNode));
      console.log(
        colorText(`Visiting [${indexToLabel(currentNode)}]`, Colors.fg.seaGreen)
      );

      for (let i = 0; i < this.size; i++) {
        if (this.matrix[currentNode][i] !== 0 && !visited[i]) {
          dfs(i);
        }
      }
    };

    dfs(node);

    console.log(
      colorText("DFS Complete. Visited nodes in order:", Colors.fg.goldOrange)
    );
    console.log(colorText(path.join(" → "), Colors.fg.seaGreen));
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
    const linkProbability = 0.3;
    const highWeightProbability = 0.5;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (Math.random() < linkProbability) {
          if (Math.random() < highWeightProbability) {
            const weight = Math.floor(Math.random() * (MAX_WEIGHT - 1)) + 2;
            this.matrix[i][j] = weight;
            if (this.orientation === "U") {
              this.matrix[j][i] = weight;
            }
          } else {
            this.matrix[i][j] = 1;
            if (this.orientation === "U") {
              this.matrix[j][i] = 1;
            }
          }
        } else {
          this.matrix[i][j] = 0;
        }
      }
    }
  }

  topologicalSort() {
    if (this.orientation !== "D") {
      console.log(
        colorText(
          "Error: Topological sort is only applicable to directed graphs.",
          Colors.fg.red
        )
      );
      return;
    }

    let inDegree = Array(this.size).fill(0);
    let queue = [];
    let topoOrder = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.matrix[j][i] > 0) {
          inDegree[i]++;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }

    while (queue.length > 0) {
      let vertex = queue.shift();
      topoOrder.push(indexToLabel(vertex));
      for (let i = 0; i < this.size; i++) {
        if (this.matrix[vertex][i] > 0) {
          inDegree[i]--;
          if (inDegree[i] === 0) {
            queue.push(i);
          }
        }
      }
    }

    if (topoOrder.length !== this.size) {
      console.log(
        colorText(
          "Error: Graph has cycles and cannot have a topological order.",
          Colors.fg.red
        )
      );
      return;
    }

    console.log(
      colorText(
        "Topological Order: " + topoOrder.join(", "),
        Colors.fg.seaGreen
      )
    );
  }

  kruskal() {
    let edges = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = i + 1; j < this.size; j++) {
        if (this.matrix[i][j] > 0) {
          edges.push({ u: i, v: j, weight: this.matrix[i][j] });
        }
      }
    }

    edges.sort((a, b) => a.weight - b.weight);

    let parent = [];
    let rank = [];

    const find = (node) => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    };

    const union = (node1, node2) => {
      let root1 = find(node1);
      let root2 = find(node2);

      if (root1 !== root2) {
        if (rank[root1] > rank[root2]) {
          parent[root2] = root1;
        } else if (rank[root1] < rank[root2]) {
          parent[root1] = root2;
        } else {
          parent[root2] = root1;
          rank[root1]++;
        }
      }
    };

    for (let i = 0; i < this.size; i++) {
      parent[i] = i;
      rank[i] = 0;
    }

    let mst = [];
    for (let edge of edges) {
      if (find(edge.u) !== find(edge.v)) {
        union(edge.u, edge.v);
        mst.push(edge);
      }
    }

    console.log("Minimum Spanning Tree:");
    mst.forEach((edge) => {
      console.log(
        `[${indexToLabel(edge.u)}]-[${indexToLabel(edge.v)}]:${edge.weight}`
      );
    });

    return mst;
  }

  findShortestPath(nodeA, nodeB) {
    if (nodeA < 0 || nodeA >= this.size || nodeB < 0 || nodeB >= this.size) {
      console.log("Error: One or both of the nodes do not exist.");
      return;
    }

    const distances = Array(this.size).fill(Infinity);
    const previous = Array(this.size).fill(null);
    const visited = new Set();

    distances[nodeA] = 0;

    const getSmallestDistanceNode = () => {
      let smallest = null;
      let smallestDistance = Infinity;
      for (let i = 0; i < this.size; i++) {
        if (!visited.has(i) && distances[i] < smallestDistance) {
          smallest = i;
          smallestDistance = distances[i];
        }
      }
      return smallest;
    };

    while (visited.size !== this.size) {
      const currentNode = getSmallestDistanceNode();
      if (currentNode === null) break;
      visited.add(currentNode);

      for (let neighbor = 0; neighbor < this.size; neighbor++) {
        if (this.matrix[currentNode][neighbor] > 0 && !visited.has(neighbor)) {
          const newDist =
            distances[currentNode] + this.matrix[currentNode][neighbor];
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            previous[neighbor] = currentNode;
          }
        }
      }
    }

    if (distances[nodeB] === Infinity) {
      console.log(
        `No path found between [${indexToLabel(nodeA)}] and [${indexToLabel(
          nodeB
        )}]`
      );
      return;
    }

    let path = [];
    for (let at = nodeB; at !== null; at = previous[at]) {
      path.push(at);
    }
    path.reverse();

    const labeledPath = path.map((node) => indexToLabel(node)).join(" -> ");

    console.log(
      `Shortest path between [${indexToLabel(nodeA)}] and [${indexToLabel(
        nodeB
      )}]: ${labeledPath} with distance ${distances[nodeB]}`
    );
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

  checkConnectedGraph() {
    if (this.size === 0) {
      console.log(
        colorText(
          "[✓] Graph is connected (trivially, as it is empty)",
          Colors.fg.seaGreen
        )
      );
      return true;
    }

    let visited = Array(this.size).fill(false);
    let queue = [0];
    visited[0] = true;
    let count = 1;

    while (queue.length > 0) {
      let node = queue.shift();
      for (let i = 0; i < this.size; i++) {
        if (this.matrix[node][i] !== 0 && !visited[i]) {
          visited[i] = true;
          queue.push(i);
          count++;
        }
      }
    }

    if (count === this.size) {
      console.log(colorText("[✓] Graph is connected", Colors.fg.seaGreen));
      return true;
    } else {
      console.log(colorText("[x] Graph is not connected", Colors.fg.red));
      return false;
    }
  }

  // --------------------------------- Ativ 2 -------------------------------------------------------

  fordFulkersonMaxFlow(source, sink) {
    let residualGraph = this.#initiateMatrix(this.size);

    // Initialize residual graph as the original graph
    for (let u = 0; u < this.size; u++) {
      for (let v = 0; v < this.size; v++) {
        residualGraph[u][v] = this.matrix[u][v];
      }
    }

    let parent = Array(this.size).fill(-1); // Array to store the path
    let maxFlow = 0; // There is no flow initially

    // Augment the flow while there is a path from source to sink
    while (this.#bfs(residualGraph, source, sink, parent)) {
      // Find the maximum flow through the path found by BFS
      let pathFlow = Infinity;
      for (let v = sink; v != source; v = parent[v]) {
        let u = parent[v];
        pathFlow = Math.min(pathFlow, residualGraph[u][v]);
      }

      // Update residual capacities of the edges and reverse edges along the path
      for (let v = sink; v != source; v = parent[v]) {
        let u = parent[v];
        residualGraph[u][v] -= pathFlow;
        residualGraph[v][u] += pathFlow;
      }

      // Add the path flow to the overall flow
      maxFlow += pathFlow;
    }

    console.log(
      colorText(`The maximum possible flow is ${maxFlow}`, Colors.fg.seaGreen)
    );

    return maxFlow;
  }

  #bfs(residualGraph, source, sink, parent) {
    let visited = Array(this.size).fill(false);
    let queue = [];
    queue.push(source);
    visited[source] = true;
    parent[source] = -1;

    while (queue.length > 0) {
      let u = queue.shift();

      for (let v = 0; v < this.size; v++) {
        if (!visited[v] && residualGraph[u][v] > 0) {
          if (v === sink) {
            parent[v] = u;
            return true;
          }
          queue.push(v);
          parent[v] = u;
          visited[v] = true;
        }
      }
    }

    return false;
  }
}
