```py
cells = 6

if cells == 0:
    print("No cells")
elif cells == 1:
    print("A single cell")
else:
    total = 0
    for i in range(1, cells + 1):
        if i % 2 == 1:
            total = total + i
    print(total)
```
