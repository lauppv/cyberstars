def to_number(s):
    try:
        return int(s), True
    except ValueError:
        return 0, False

readings = ["42", "x9", "100", "7", "bad", "13"]
total = 0
corrupted = 0
i = 0
while i < len(readings):
    value, ok = to_number(readings[i])
    if ok:
        total += value
    else:
        corrupted += 1
    i += 1
print(f"Total: {total}")
print(f"Corrupted: {corrupted}")
