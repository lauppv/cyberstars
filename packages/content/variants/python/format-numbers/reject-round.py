tanks = [1250.5, 87.25, 30000]
total = 0
for i in range(len(tanks)):
    print("Tank 0" + str(i + 1) + ": " + str(round(tanks[i], 2)) + " L")
    total = total + tanks[i]
print("Total: " + str(round(total, 2)) + " L")
