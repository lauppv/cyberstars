readings = ["10", "bad", "25", "7", "x"]


def safe_int(text, fallback=0):
    try:
        return int(text)
    except ValueError:
        return fallback


def summarize(numbers):
    return sum(numbers), max(numbers), min(numbers)


numbers = []
for r in readings:
    v = safe_int(r, None)
    if v is not None:
        numbers.append(v)
print(f"Numbers: {numbers}")
total, largest, smallest = summarize(numbers)
print(f"Total: {total}")
print(f"Largest: {largest}")
print(f"Smallest: {smallest}")
