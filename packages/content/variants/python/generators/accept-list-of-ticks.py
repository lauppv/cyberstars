def burn(fuel, rate):
    left = fuel
    while True:
        left = left - rate
        if left < 0:
            return
        yield left


fuel = 10
rate = 3
first = next(burn(fuel, rate), None)
print("First: " + ("none" if first is None else str(first)))
ticks = list(burn(fuel, rate))
for i, t in enumerate(ticks):
    print(f"Tick {i + 1}: {t}")
print(f"Ticks: {len(ticks)}")
