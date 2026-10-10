codes = [1234, 999, 5, 4070, 88]

def digits_of(text):
    if text == "":
        return 0
    return int(text[0]) + digits_of(text[1:])

def sum_digits(n):
    return digits_of(str(n))

best = None
for c in codes:
    v = sum_digits(c)
    print(f"{c}: {v}")
    if best is None or v > best:
        best = v
print(f"Largest checksum: {best}")
