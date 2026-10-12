while True:
    number = int(input())
    if number == 0:
        break
    if number < 0:
        number = -number
    print(f"Sector {number} checked")
print("Scan complete")
