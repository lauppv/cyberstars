readings = ["10", "bad", "25", "7", "x"]
numbers = []


def safe_int(text, fallback=0):
    try:
        numbers.append(int(text))
    except ValueError:
        numbers.append(fallback)


def summarize(values):
    print(f"Total: {sum(values)}")
    print(f"Largest: {max(values)}")
    print(f"Smallest: {min(values)}")


for r in readings:
    safe_int(r)
print(f"Numbers: {numbers}")
summarize(numbers)
