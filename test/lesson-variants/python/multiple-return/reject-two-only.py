def parse(reading):
    a, b, c = map(int, reading.split(" "))
    return a + b + c, max(a, b), min(a, b)


total, largest, smallest = parse(input())
print(f"Total: {total}")
print(f"Largest: {largest}")
print(f"Smallest: {smallest}")
