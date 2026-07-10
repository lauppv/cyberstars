```py
def sortare_bule(numere):
    for i in range(len(numere)):
        for j in range(len(numere) - 1):
            if numere[j] > numere[j + 1]:
                numere[j], numere[j + 1] = numere[j + 1], numere[j]
    return numere

lot1 = [42, 17, 88, 9, 23]
lot2 = [5, 4, 3, 2, 1]
print(sortare_bule(lot1))
print(sortare_bule(lot2))
```
