rows = int(input())
row = 1
while row <= rows:
    star = 0
    while star < row:
        print("*", end="")
        star += 1
    print()
    row += 1
