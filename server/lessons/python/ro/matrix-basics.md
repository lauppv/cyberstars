O **matrice** este o grilă de numere organizate în **rânduri** și **coloane**. Gândește-te la o foaie de calcul, o tablă de șah sau un ecran de pixeli — toate sunt grile. În Python, reprezentăm o matrice ca o **listă de liste**

```py
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

Aceasta este o matrice **3×3** (3 rânduri, 3 coloane). Fiecare listă interioară este un **rând**

Ca să accesăm un element, folosim **doi indecși**: **matrix[rând][coloană]**

```py
print(matrix[0][0])   # 1  (rândul 0, coloana 0)
print(matrix[1][2])   # 6  (rândul 1, coloana 2)
print(matrix[2][1])   # 8  (rândul 2, coloana 1)
```

---

Ca să parcurgem fiecare element, folosim **bucle imbricate**

```py
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for element in row:
        print(element, end=" ")
    print()
```

Rezultat

```text
1 2 3
4 5 6
7 8 9
```

Bucla exterioară parcurge fiecare **rând** (care este o listă). Bucla interioară parcurge fiecare **element** din acel rând. **print()** de la final începe o linie nouă după fiecare rând

---

Dacă avem nevoie de **indecși** (ca să știm unde suntem)

```py
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        print(f"[{i}][{j}] = {matrix[i][j]}")
```

---

Operații frecvente pe matrice

**Suma tuturor elementelor**

```py
total = 0
for row in matrix:
    for element in row:
        total += element
print(total)
```

Rezultat **45**

**Găsește maximul**

```py
biggest = matrix[0][0]
for row in matrix:
    for element in row:
        if element > biggest:
            biggest = element
print(biggest)
```

Rezultat **9**

---

Un caz de utilizare din viața reală: imaginează-ți o hartă de joc unde 0 este gol și 1 este un zid

```py
gameMap = [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0]
]

walls = 0
for row in gameMap:
    for cell in row:
        if cell == 1:
            walls += 1
print(f"Numărul de ziduri: {walls}")
```

Rezultat **Numărul de ziduri: 4**

---

## Misiune: Grila de Senzori

Senzorii de pe carena stației își raportează citirile sub forma unei **grile 4×4** (o listă de liste, deja în dreapta). Controlul Misiunii vrea un rezumat rapid al grilei.

Folosind **bucle imbricate**, afișează:

1. **Suma fiecărui rând**, câte una pe linie, etichetată `Rând 1: `, `Rând 2: `, și așa mai departe (rândurile numerotate de la 1).
2. `Max: ` urmat de cea mai **mare** citire de oriunde din grilă.
3. `Peste 7: ` urmat de **câte** citiri sunt strict mai mari decât 7.

**Rezultat**

```text
Rând 1: 22
Rând 2: 26
Rând 3: 15
Rând 4: 37
Max: 10
Peste 7: 7
```
