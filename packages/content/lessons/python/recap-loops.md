Put together range with steps, enumerate, zip and nested lists

---

## Mission: Cargo Manifest

A supply ship has docked. For each kind of cargo the ship has a list of boxes, and each box has its weight. The station's computer needs a manifest, and the crew checks every third kind of cargo by hand

1. Start your program with two variables: **items**, a list of strings, and **boxes**, a list of lists of whole numbers: the weights of the boxes of each item, in kilograms, in the same order as the items. For example `items = ["water", "food", "tools", "fuel"]` and `boxes = [[50, 50, 50], [20, 25], [], [80]]`
2. For each item, print its number counted from 1, `. `, the item, `: boxes `, how many boxes it has, `, weight `, and their total weight, then ` kg`
3. Print `Spot check: ` and the items at positions 0, 3, 6 and so on, joined with `, `

Use `zip()` and `enumerate()`. The two lists have the same length, from 1 to 20 items, and each item has from 0 to 10 boxes of 1 to 100 kg

**Example** for the items and boxes above

```text
1. water: boxes 3, weight 150 kg
2. food: boxes 2, weight 45 kg
3. tools: boxes 0, weight 0 kg
4. fuel: boxes 1, weight 80 kg
Spot check: water, fuel
```
