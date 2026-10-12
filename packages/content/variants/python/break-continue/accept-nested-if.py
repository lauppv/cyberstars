while True:
    sector = int(input("Sector: "))
    if sector < 0:
        continue
    elif sector == 0:
        break
    else:
        print("Sector", sector, "checked")
print("Scan complete")
