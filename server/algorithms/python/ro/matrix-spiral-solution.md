```py
n = int(input())
matrice = [list(map(int, input().split())) for _ in range(n)]

sus, jos = 0, n - 1
stanga, dreapta = 0, n - 1
rezultat = []

while sus <= jos and stanga <= dreapta:
    for col in range(stanga, dreapta + 1):
        rezultat.append(matrice[sus][col])
    sus += 1

    for rand in range(sus, jos + 1):
        rezultat.append(matrice[rand][dreapta])
    dreapta -= 1

    if sus <= jos:
        for col in range(dreapta, stanga - 1, -1):
            rezultat.append(matrice[jos][col])
        jos -= 1

    if stanga <= dreapta:
        for rand in range(jos, sus - 1, -1):
            rezultat.append(matrice[rand][stanga])
        stanga += 1

print(' '.join(str(x) for x in rezultat))
```
