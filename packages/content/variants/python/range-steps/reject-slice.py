readings = [12, 15, 11, 18, 20]
count = 0
for value in readings[::-2]:
    count += 1
    print(f"{len(readings) - 1 - 2 * (count - 1)}: {value}")
print(f"Checked: {count}")
