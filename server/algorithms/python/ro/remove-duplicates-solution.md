```py
n = int(input())
numere = list(map(int, input().split()))

vazute = set()
rezultat = []
for numar in numere:
    if numar not in vazute:
        vazute.add(numar)
        rezultat.append(numar)

print(' '.join(str(x) for x in rezultat))
```
