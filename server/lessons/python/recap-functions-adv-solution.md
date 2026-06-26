```py
readings = ["10", "bad", "25", "7", "x"]

def safe_int(text, fallback=0):
    try:
        return int(text)
    except ValueError:
        return fallback

def summarize(numbers):
    return sum(numbers), max(numbers), min(numbers)

numbers = []
for reading in readings:
    numbers.append(safe_int(reading))

print(f"Numbers: {numbers}")
total, largest, smallest = summarize(numbers)
print(f"Total: {total}")
print(f"Largest: {largest}")
print(f"Smallest: {smallest}")
```
