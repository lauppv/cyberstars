Put together `import`, and the modules math, random, collections and datetime

---

## Mission: Launch Planner

Several ships wait to leave the station, one launch a day. The order is drawn by lot, from a seed, so the plan can be checked later. Each flight takes a number of hours that depends on its distance

1. Start your program with four variables: **seed**, a whole number, **start**, a string with the first launch day like `"2031-05-14"`, **ships**, a list of names, and **distances**, a list of whole numbers: each ship's distance in kilometers, in the same order as the names. For example `seed = 5`, `start = "2031-05-14"`, `ships = ["Hope", "Swift", "Bob"]` and `distances = [7000, 3000, 9500]`
2. Set the seed with `random.seed(seed)`, then draw the launch order with one call: `random.sample(ships, len(ships))`
3. For each ship in that order, print a line: its launch date as the day with two digits and the month's short name, like `14 May`, then `: `, the ship, `, `, the hours of its flight and ` h`. The first ship leaves on the start day, the next one a day later, and so on. A flight takes one hour for every 3,000 km, and a part of an hour counts as a whole hour
4. Print `Total: ` and the hours of all the flights added up, then ` h`
5. Print `Most common: `, the number of hours that comes up most often, a space, `h,` and a space, and how many flights take that long. If several come up equally often, take the one that comes first in the launch order

Use `math`, `random`, `collections` and `datetime`. There are from 1 to 10 ships, with different names, and each distance is from 1 to 50,000 km. `%b` in `strftime()` gives the month's short name

**Example** for the values above

```text
14 May: Bob, 4 h
15 May: Swift, 1 h
16 May: Hope, 3 h
Total: 8 h
Most common: 4 h, 1
```
