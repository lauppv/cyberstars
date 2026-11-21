def burn(fuel, rate):
    while fuel - rate >= 0:
        fuel -= rate
        yield fuel


fuel = 10
rate = 3
g = burn(fuel, rate)
print(f"First: {next(g, 'none')}")
n = 0
for n, v in enumerate(g, 1):
    print(f"Tick {n}: {v}")
print(f"Ticks: {n}")
