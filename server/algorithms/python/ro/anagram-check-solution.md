```py
a = input().lower()
b = input().lower()

if len(a) != len(b):
    print(False)
else:
    aparitii = {}
    for c in a:
        if c in aparitii:
            aparitii[c] = aparitii[c] + 1
        else:
            aparitii[c] = 1

    for c in b:
        if c in aparitii:
            aparitii[c] = aparitii[c] - 1
        else:
            aparitii[c] = -1

    sunt_anagrame = True
    for c in aparitii:
        if aparitii[c] != 0:
            sunt_anagrame = False
            break

    print(sunt_anagrame)
```
