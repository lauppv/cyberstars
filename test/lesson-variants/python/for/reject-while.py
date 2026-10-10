cells = 6

if cells == 0:
    print("No cells")
elif cells == 1:
    print("A single cell")
else:
    total = 0
    i = 1
    while i <= cells:
        total += i
        i += 2
    print(total)
