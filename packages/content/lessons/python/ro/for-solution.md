```py
celule = 6

if celule == 0:
    print("Fara celule")
elif celule == 1:
    print("O singura celula")
else:
    total = 0
    for i in range(1, celule + 1):
        if i % 2 == 1:
            total = total + i
    print(total)
```
