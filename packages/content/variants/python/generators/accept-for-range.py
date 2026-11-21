def burn(fuel, rate):
    for left in range(fuel - rate, -1, -rate):
        yield left


fuel = 10
rate = 3
g = burn(fuel, rate)
try:
    print("First:", next(g))
except StopIteration:
    print("First: none")
count = 0
for left in burn(fuel, rate):
    count += 1
    print(f"Tick {count}: {left}")
print("Ticks:", count)
