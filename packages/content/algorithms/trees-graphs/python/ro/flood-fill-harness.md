```py
{{code: umple_zona}}


randuri, coloane = map(int, input().split())
grila = [list(input()) for r in range(randuri)]
r, c, culoare = input().split()
umple_zona(grila, int(r), int(c), culoare)
for rand in grila:
    print("".join(rand))
```
