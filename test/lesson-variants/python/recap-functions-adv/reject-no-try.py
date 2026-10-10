readings = ["10", "bad", "25", "7", "x"]


def safe_int(text, fallback=0):
    body = text.strip()
    digits = body[1:] if body[:1] in "+-" else body
    if digits.isdigit() and digits.isascii():
        return int(body)
    return fallback


def summarize(numbers):
    return sum(numbers), max(numbers), min(numbers)


numbers = [safe_int(r) for r in readings]
print(f"Numbers: {numbers}")
total, largest, smallest = summarize(numbers)
print(f"Total: {total}")
print(f"Largest: {largest}")
print(f"Smallest: {smallest}")
