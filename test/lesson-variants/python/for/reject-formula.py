cells = 6
if cells == 0:
    print("No cells")
elif cells == 1:
    print("A single cell")
else:
    print(((cells + 1) // 2) ** 2)
