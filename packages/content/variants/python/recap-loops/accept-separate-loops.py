items = ["water", "food", "tools", "fuel"]
boxes = [[50, 50, 50], [20, 25], [], [80]]
lines = []
for item, weights in zip(items, boxes):
    total = 0
    for w in weights:
        total += w
    lines.append(f"{item}: boxes {len(weights)}, weight {total} kg")
for n, line in enumerate(lines, 1):
    print(f"{n}. {line}")
print("Spot check: " + ", ".join(items[::3]))
