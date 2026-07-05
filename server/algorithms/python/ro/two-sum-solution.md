```py
parti = input().split()

numere = []
i = 0
while i < len(parti):
    numere.append(int(parti[i]))
    i = i + 1

tinta = int(input())

# Pentru fiecare numar, "complementul" este cat mai lipseste pana la tinta.
# Salvam intr-un dictionar fiecare numar vazut cu indicele lui,
# ca sa putem verifica rapid daca am mai intalnit complementul.
vazute = {}

i = 0
while i < len(numere):
    numar = numere[i]
    complement = tinta - numar

    if complement in vazute:
        print(vazute[complement], i)
        break

    vazute[numar] = i
    i = i + 1
```
