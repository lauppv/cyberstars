readings = ["42", "x9", "100", "7", "bad", "13"]
total = 0
corrupted = 0
for reading in readings:
    digits = reading[1:] if reading.startswith("-") else reading
    if digits.isdigit():
        total += int(reading)
    else:
        corrupted += 1
print(f"Total: {total}")
print(f"Corrupted: {corrupted}")
