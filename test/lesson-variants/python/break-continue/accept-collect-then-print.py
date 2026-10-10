checked = []
while True:
    value = int(input())
    if value == 0:
        break
    if value < 0:
        continue
    checked.append(value)
for s in checked:
    print(f"Sector {s} checked")
print("Scan complete")
