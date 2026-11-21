class Ship:
    pass


names = ["Hope", "Swift", "Bob"]
speeds = [12, 30, 5]
Ship()
for n, s in zip(names, speeds):
    print(f"{n}: {s}")
print(f"Fastest: {names[speeds.index(min(speeds))]}")
