readings = ["42", "x9", "100", "7", "bad", "13"]
total = 0
corrupted = 0
try:
    for reading in readings:
        total += int(reading)
except ValueError:
    corrupted += 1
print(f"Total: {total}")
print(f"Corrupted: {corrupted}")
