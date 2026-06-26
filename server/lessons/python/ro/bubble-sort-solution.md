```py
def sortare_bule(numere):
    for i in range(len(numere)):
        for j in range(len(numere) - 1):
            if numere[j] > numere[j + 1]:
                numere[j], numere[j + 1] = numere[j + 1], numere[j]
    return numere

print(sortare_bule([42, 17, 88, 9, 23]))
print(sortare_bule([5, 4, 3, 2, 1]))
```
