Plain javascript. No libs were used here

Node version: v20.11.1

run

```
node interfaceAtiv1.mjs
```

for the full set of instructions (First activity)

Activty 2:

You are helping the medical consulting firm "Doctors Without Weekends" organize doctors' work schedules at a large hospital. Most of the regular daily schedules are already set. Now, you need to deal with the special cases: ensure that there is at least one doctor on duty on each day of special periods, such as holidays (e.g. Christmas, 4th of July, Thanksgiving).

There are k vacation periods, each covering several consecutive days. Let Dj be the set of days in the j-th vacation period. The union of all these days, ⋃jDj, forms the set of all vacation days.

In the hospital, there are n doctors. Each doctor i has a set Si​ of vacation days on which he or she is available to work. This may include certain days of a specific vacation period, but not every day of that period.

An efficient algorithm must be developed to determine whether it is possible to select a doctor to work on each vacation day, respecting the following restrictions:

Each doctor can be assigned to work a maximum of c vacation days in total, where c is a given parameter.
For each vacation period j, each doctor can be assigned to work on a maximum of one of the days in the Dj set

The algorithm must return an assignment of doctors that satisfies these constraints or indicate that such an assignment is not possible.

run

```
node interfaceAtiv2.mjs
```

for the reduced set os instructions (Second activity)

Also run

```
node examples/doctorsWithoutWeekends.mjs
```

To a possible outcome of the exercise

or

```
node examples/doctorsWithoutWeekendsFail.mjs
```

To a failed outcome of the exercise
