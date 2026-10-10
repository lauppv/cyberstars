import sys

for line in sys.stdin:
    number = int(line)
    if number == 0:
        break
    if number < 0:
        continue
    print(f"Sector {number} checked")
print("Scan complete")
