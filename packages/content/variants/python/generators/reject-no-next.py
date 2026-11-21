def burn(fuel, rate):
    while fuel - rate >= 0:
        fuel -= rate
        yield fuel


fuel = 10
rate = 3

first = "none"
for left in burn(fuel, rate):
    first = left
    break
print(f"First: {first}")
ticks = 0
for tick, left in enumerate(burn(fuel, rate), start=1):
    print(f"Tick {tick}: {left}")
    ticks = tick
print(f"Ticks: {ticks}")
