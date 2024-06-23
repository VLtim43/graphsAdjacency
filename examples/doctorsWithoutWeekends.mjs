import { Graph, letterToIndex } from "../graph.mjs";
import { Colors } from "../colors.mjs";
import { colorText } from "../colors.mjs";

const c = 2; // Max number of days a doctor can work

// Doctors days
const doctors = [
  { name: "Doctor A", availableDays: [1, 2, 3] },
  { name: "Doctor B", availableDays: [2, 3, 4] },
];

console.log(colorText("\nDoctors' Available Days:", Colors.fg.lightLavender));
doctors.forEach((doctor) => {
  console.log(
    `${colorText(
      doctor.name,
      Colors.fg.lightLavender
    )}: Days ${doctor.availableDays.join(", ")}`
  );
});

// Vacation periods
const periods = [
  { name: "Period 1", days: [1, 2] }, // Days 1 and 2
  { name: "Period 2", days: [3, 4] }, // Days 3 and 4
];

console.log(colorText("Periods of Holidays:", Colors.fg.lightLavender));
periods.forEach((period) => {
  console.log(
    `${colorText(
      period.name,
      Colors.fg.lightLavender
    )}: Days ${period.days.join(", ")}`
  );
});

// Log max number of days a doctor can work
console.log(
  colorText(
    `\nMax number of days a doctor can work (c): ${c}`,
    Colors.fg.lightLavender
  )
);

// In this example:
// Create a graph with 10 nodes
// 0: Source (S), 1: Doctor A, 2: Doctor B, 3: Period 1 (P1), 4: Period 2 (P2), 5: Day 1, 6: Day 2, 7: Day 3, 8: Day 4, 9: Sink (T)
const graph = new Graph(10, "D");

// Source to doctors
graph.linkNodes(0, 1, c); // S -> A
graph.linkNodes(0, 2, c); // S -> B

// Doctors to intermediate period nodes
graph.linkNodes(1, 3, 1); // A -> P1 (day 1 or 2)
graph.linkNodes(1, 4, 1); // A -> P2 (day 3)
graph.linkNodes(2, 3, 1); // B -> P1 (day 2)
graph.linkNodes(2, 4, 1); // B -> P2 (day 3 or 4)

// Intermediate period nodes to vacation days
graph.linkNodes(3, 5, 1); // P1 -> Day 1
graph.linkNodes(3, 6, 1); // P1 -> Day 2
graph.linkNodes(4, 7, 1); // P2 -> Day 3
graph.linkNodes(4, 8, 1); // P2 -> Day 4

// Vacation days to sink
graph.linkNodes(5, 9, 1); // Day 1 -> T
graph.linkNodes(6, 9, 1); // Day 2 -> T
graph.linkNodes(7, 9, 1); // Day 3 -> T
graph.linkNodes(8, 9, 1); // Day 4 -> T

// Display the graph
console.log(colorText("\nAdjacency List:", Colors.fg.lightLavender));
graph.displayAdjacencyList();

// Set source and sink
const source = 0; // Node S
const sink = 9; // Node T

// Calculate the maximum flow
graph.fordFulkersonMaxFlow(source, sink);
