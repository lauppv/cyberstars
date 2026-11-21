tanks = [1250.5, 87.25, 30000]
number = 1
total = 0
for liters in tanks:
    line = "Tank " + format(number, "02") + ": " + format(liters, ">10,.2f") + " L"
    print(line)
    number = number + 1
    total = total + liters
print("Total:   " + format(total, ">10,.2f") + " L")
