readings = ["10", "bad", "25", "7", "x"]


def safe_int(text, fallback=0):
    if text.isdigit():
        return int(text)
    return fallback


def summarize(numbers):
    return sum(numbers), max(numbers), min(numbers)


numbers = [safe_int(r) for r in readings]
print(f"Numbers: {numbers}")
total, largest, smallest = summarize(numbers)
print(f"Total: {total}")
print(f"Largest: {largest}")
print(f"Smallest: {smallest}")
