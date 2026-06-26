```py
def parse(reading):
    parts = reading.split(" ")
    a = int(parts[0])
    b = int(parts[1])
    c = int(parts[2])
    return a + b + c, max(a, b, c), min(a, b, c)

reading = input()
total, largest, smallest = parse(reading)
print(f"Total: {total}")
print(f"Largest: {largest}")
print(f"Smallest: {smallest}")
```
