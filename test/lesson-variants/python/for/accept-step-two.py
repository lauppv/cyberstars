cells = 6

if cells == 0:
    print("No cells")
elif cells == 1:
    print("A single cell")
else:
    s = 0
    for k in range(1, cells + 1, 2):
        s += k
    print(s)
