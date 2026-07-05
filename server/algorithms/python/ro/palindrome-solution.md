```py
sir = input()

este_palindrom = True
stanga = 0
dreapta = len(sir) - 1
while stanga < dreapta:
    if sir[stanga] != sir[dreapta]:
        este_palindrom = False
        break
    stanga = stanga + 1
    dreapta = dreapta - 1

print(este_palindrom)
```
