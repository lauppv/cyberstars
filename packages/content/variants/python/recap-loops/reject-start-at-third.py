items = ["water", "food", "tools", "fuel"]
boxes = [[50, 50, 50], [20, 25], [], [80]]
for n, (item, w) in enumerate(zip(items, boxes), start=1):
    print(f"{n}. {item}: boxes {len(w)}, weight {sum(w)} kg")
print("Spot check: " + ", ".join(items[2::3]))
