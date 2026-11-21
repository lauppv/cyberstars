```py
def burn(fuel, rate):
    while fuel - rate >= 0:
        fuel -= rate
        yield fuel


fuel = 10
rate = 3

print(f"First: {next(burn(fuel, rate), 'none')}")
ticks = 0
for tick, left in enumerate(burn(fuel, rate), start=1):
    print(f"Tick {tick}: {left}")
    ticks = tick
print(f"Ticks: {ticks}")
```
