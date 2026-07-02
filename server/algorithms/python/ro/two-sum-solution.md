```py
numere = list(map(int, input().split()))
tinta = int(input())

vazute = {}
for i, numar in enumerate(numere):
    complement = tinta - numar
    if complement in vazute:
        print(vazute[complement], i)
        break
    vazute[numar] = i
```
