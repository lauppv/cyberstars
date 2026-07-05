```py
n = int(input())
numere = list(map(int, input().split()))

maxim = numere[0]
for i in range(1, n):
    if numere[i] > maxim:
        maxim = numere[i]

print(maxim)
```
