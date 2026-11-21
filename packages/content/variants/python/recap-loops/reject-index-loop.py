items = ["water", "food", "tools", "fuel"]
boxes = [[50, 50, 50], [20, 25], [], [80]]

for i in range(min(len(items), len(boxes))):
    weights = boxes[i]
    print(f"{i + 1}. {items[i]}: boxes {len(weights)}, weight {sum(weights)} kg")

checked = []
for i in range(0, len(items), 3):
    checked.append(items[i])
print(f"Spot check: {', '.join(checked)}")
