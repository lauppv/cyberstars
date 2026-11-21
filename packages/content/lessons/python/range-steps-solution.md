```py
readings = [12, 15, 11, 18, 20]

checked = 0
for i in range(len(readings) - 1, -1, -2):
    print(f"{i}: {readings[i]}")
    checked += 1
print(f"Checked: {checked}")
```
