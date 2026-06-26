```py
def putere(baza, exponent):
    if exponent == 0:
        return 1
    return baza * putere(baza, exponent - 1)

baza = 2
for exponent in range(5):
    print(f"{baza}^{exponent} = {putere(baza, exponent)}")
```
