readings = ["10", "bad", "25", "7", "x"]


def safe_int(text, fallback=0):
    try:
        value = int(text)
    except (ValueError, TypeError):
        value = fallback
    return value


def summarize(values):
    ordered = sorted(values)
    return sum(values), ordered[-1], ordered[0]


numbers = [safe_int(r) for r in readings]
print("Numbers:", numbers)
t, hi, lo = summarize(numbers)
print("Total:", t)
print("Largest:", hi)
print("Smallest:", lo)
