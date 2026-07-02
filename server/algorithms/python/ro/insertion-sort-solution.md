```py
n = int(input())
numere = list(map(int, input().split()))

for i in range(1, len(numere)):
    curent = numere[i]
    j = i - 1
    while j >= 0 and numere[j] > curent:
        numere[j + 1] = numere[j]
        j -= 1
    numere[j + 1] = curent

print(' '.join(str(x) for x in numere))
```
