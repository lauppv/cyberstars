scanning = True
while scanning:
    number = int(input())
    if number == 0:
        scanning = False
        continue
    if number < 0:
        continue
    print(f"Sector {number} checked")
print("Scan complete")
