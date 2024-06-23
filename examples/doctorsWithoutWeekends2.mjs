import { Graph, letterToIndex } from "../graph.mjs";
import { Colors } from "../colors.mjs";
import { colorText } from "../colors.mjs";

const c = 3; // Max number of days a doctor can work

// Doctors days
const doctors = [
  { name: "Doctor A", availableDays: [1, 2, 3] },
  { name: "Doctor B", availableDays: [2, 3, 4] },
  { name: "Doctor C", availableDays: [3, 4, 5, 8] },
  { name: "Doctor D", availableDays: [4, 5, 7] },
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
  { name: "Period 3", days: [5, 6] }, // Days 5 and 6
  { name: "Period 4", days: [7, 8] }, // Days 7 and 8
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

// Create a graph with 18 nodes
// 0: Source (S), 1: Doctor A, 2: Doctor B, 3: Doctor C, 4: Doctor D
// 5: Period 1 (P1), 6: Period 2 (P2), 7: Period 3 (P3), 8: Period 4 (P4)
// 9: Day 1, 10: Day 2, 11: Day 3, 12: Day 4, 13: Day 5, 14: Day 6, 15: Day 7, 16: Day 8, 17: Sink (T)
const graph = new Graph(18, "D");

// Source to doctors
graph.linkNodes(0, 1, c); // S -> A
graph.linkNodes(0, 2, c); // S -> B
graph.linkNodes(0, 3, c); // S -> C
graph.linkNodes(0, 4, c); // S -> D

// Doctors to intermediate period nodes
graph.linkNodes(1, 5, 1); // A -> P1 (day 1 or 2)
graph.linkNodes(1, 6, 1); // A -> P2 (day 3)
graph.linkNodes(2, 5, 1); // B -> P1 (day 2)
graph.linkNodes(2, 6, 1); // B -> P2 (day 3 or 4)
graph.linkNodes(3, 6, 1); // C -> P2 (day 4)
graph.linkNodes(3, 7, 1); // C -> P3 (day 5)
graph.linkNodes(3, 8, 1); // C -> P4 (day 8)
graph.linkNodes(4, 6, 1); // D -> P2 (day 4)
graph.linkNodes(4, 7, 1); // D -> P3 (day 5)
graph.linkNodes(4, 8, 1); // D -> P4 (day 7)

// Intermediate period nodes to vacation days
graph.linkNodes(5, 9, 1); // P1 -> Day 1
graph.linkNodes(5, 10, 1); // P1 -> Day 2
graph.linkNodes(6, 11, 1); // P2 -> Day 3
graph.linkNodes(6, 12, 1); // P2 -> Day 4
graph.linkNodes(7, 13, 1); // P3 -> Day 5
graph.linkNodes(7, 14, 1); // P3 -> Day 6
graph.linkNodes(8, 15, 1); // P4 -> Day 7
graph.linkNodes(8, 16, 1); // P4 -> Day 8

// Vacation days to sink
graph.linkNodes(9, 17, 1); // Day 1 -> T
graph.linkNodes(10, 17, 1); // Day 2 -> T
graph.linkNodes(11, 17, 1); // Day 3 -> T
graph.linkNodes(12, 17, 1); // Day 4 -> T
graph.linkNodes(13, 17, 1); // Day 5 -> T
graph.linkNodes(14, 17, 1); // Day 6 -> T
graph.linkNodes(15, 17, 1); // Day 7 -> T
graph.linkNodes(16, 17, 1); // Day 8 -> T

// Set source and sink
const source = 0; // Node S
const sink = 17; // Node T

// Calculate the maximum flow
const maxFlow = graph.fordFulkersonMaxFlow(source, sink);

const totalVacationDays = periods.reduce(
  (sum, period) => sum + period.days.length,
  0
);

if (maxFlow === totalVacationDays) {
  console.log(
    colorText("It is possible to cover all vacation days.", Colors.fg.seaGreen)
  );
} else {
  console.log(
    colorText("It is not possible to cover all vacation days.", Colors.fg.red)
  );
}
