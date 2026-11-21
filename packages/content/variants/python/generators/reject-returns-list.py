def burn(fuel, rate):
    out = []
    while fuel - rate >= 0:
        fuel -= rate
        out.append(fuel)
    return out


fuel = 10
rate = 3
values = burn(fuel, rate)
print(f"First: {values[0] if values else 'none'}")
for i, v in enumerate(values, 1):
    print(f"Tick {i}: {v}")
print(f"Ticks: {len(values)}")
next(iter(values), None)
