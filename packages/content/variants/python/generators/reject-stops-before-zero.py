def burn(fuel, rate):
    while fuel - rate > 0:
        fuel -= rate
        yield fuel


fuel = 10
rate = 3
print(f"First: {next(burn(fuel, rate), 'none')}")
n = 0
for n, v in enumerate(burn(fuel, rate), 1):
    print(f"Tick {n}: {v}")
print(f"Ticks: {n}")
