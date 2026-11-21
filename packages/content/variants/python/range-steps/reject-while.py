readings = [12, 15, 11, 18, 20]
i = len(readings) - 1
checked = 0
while i >= 0:
    print(f"{i}: {readings[i]}")
    checked += 1
    i -= 2
print(f"Checked: {checked}")
