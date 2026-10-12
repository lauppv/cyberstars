```py
def sortare_selectie(numere):
    for i in range(len(numere)):
        index_minim = i
        for j in range(i + 1, len(numere)):
            if numere[j] < numere[index_minim]:
                index_minim = j
        numere[i], numere[index_minim] = numere[index_minim], numere[i]
    return numere

lot1 = [64, 25, 12, 22, 11]
lot2 = [9, 7, 5, 3, 1]
print(sortare_selectie(lot1))
print(sortare_selectie(lot2))
```
