cells = 6
odd = []
for n in range(cells + 1):
    if n % 2:
        odd.append(n)
if cells == 0:
    print("No cells")
elif cells == 1:
    print("A single cell")
else:
    print(sum(odd))
