items = ["water", "food", "tools", "fuel"]
boxes = [[50, 50, 50], [20, 25], [], [80]]
spot = []
for i, (name, b) in enumerate(zip(items, boxes)):
    print(str(i + 1) + ". " + name + ": boxes " + str(len(b)) + ", weight " + str(sum(b)) + " kg")
    if i % 3 == 0:
        spot.append(name)
print("Spot check:", ", ".join(spot))
