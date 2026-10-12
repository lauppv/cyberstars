systems = [("Sol", 0, 8), ("Alpha", 4, 3), ("Vega", 25, 5)]
count = 0
for star, ly, p in systems:
    print(star + ": " + str(ly) + " ly, " + str(p) + " planets")
    count += p
print("Total planets:", count)
