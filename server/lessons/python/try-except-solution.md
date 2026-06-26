```py
readings = ["42", "x9", "100", "7", "bad", "13"]

total = 0
corrupted = 0
for reading in readings:
    try:
        total = total + int(reading)
    except ValueError:
        corrupted = corrupted + 1

print(f"Total: {total}")
print(f"Corrupted: {corrupted}")
```
