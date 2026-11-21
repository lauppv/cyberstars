readings = [12, 15, 11, 18, 20]
for position in range(len(readings) - 1, -1, -2):
    print(str(position) + ": " + str(readings[position]))
print("Checked:", (len(readings) + 1) // 2)
