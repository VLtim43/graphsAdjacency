import { Graph, letterToIndex } from "../graph.mjs";
import { Colors } from "../colors.mjs";
import { colorText } from "../colors.mjs";

// Create a graph with 6 nodes
const graph = new Graph(6, "D");

// Add edges with weights using letterToIndex to convert letters to indices
graph.linkNodes(0, 1, 7);
graph.linkNodes(0, 4, 4);
graph.linkNodes(1, 2, 5);
graph.linkNodes(4, 1, 3);
graph.linkNodes(1, 3, 3);
graph.linkNodes(4, 3, 2);
graph.linkNodes(2, 5, 8);
graph.linkNodes(3, 5, 5);
graph.linkNodes(3, 3, 2);

// Display the graph
console.log(colorText("Adjacency Matrix:", Colors.fg.lightLavender));
graph.displayMatrixAsTable();

console.log(colorText("Adjacency List:", Colors.fg.lightLavender));
graph.displayAdjacencyList();

// Set source and sink
const source = letterToIndex("A"); // Node A
const sink = letterToIndex("F"); // Node F

// Calculate the maximum flow
graph.fordFulkersonMaxFlow(source, sink);
