```py
items = ["water", "food", "tools", "fuel"]
boxes = [[50, 50, 50], [20, 25], [], [80]]

for number, (item, weights) in enumerate(zip(items, boxes), start=1):
    print(f"{number}. {item}: boxes {len(weights)}, weight {sum(weights)} kg")

checked = []
for i in range(0, len(items), 3):
    checked.append(items[i])
print(f"Spot check: {', '.join(checked)}")
```
