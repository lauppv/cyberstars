rows = int(input())
for row in range(1, rows):
    for star in range(row):
        print("*", end="")
    print()
