```py
grila = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]

for i in range(len(grila)):
    total = 0
    for valoare in grila[i]:
        total += valoare
    print(f"Rand {i + 1}: {total}")

cel_mai_mare = grila[0][0]
peste = 0
for rand in grila:
    for valoare in rand:
        if valoare > cel_mai_mare:
            cel_mai_mare = valoare
        if valoare > 7:
            peste += 1

print(f"Max: {cel_mai_mare}")
print(f"Peste 7: {peste}")
```
