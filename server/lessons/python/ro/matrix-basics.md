O **matrice** este o grilă de numere organizate în **rânduri** și **coloane**. Gândește-te la o foaie de calcul, o tablă de șah sau un ecran de pixeli — toate sunt grile. În Python, reprezentăm o matrice ca o **listă de liste**

```py
matrice = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

Aceasta este o matrice **3×3** (3 rânduri, 3 coloane). Fiecare listă interioară este un **rând**

Ca să accesăm un element, folosim **doi indecși**: **matrice[rand][coloana]**

```py
print(matrice[0][0])   # 1  (randul 0, coloana 0)
print(matrice[1][2])   # 6  (randul 1, coloana 2)
print(matrice[2][1])   # 8  (randul 2, coloana 1)
```

---

Ca să parcurgem fiecare element, folosim **bucle imbricate**

```py
matrice = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for rand in matrice:
    for element in rand:
        print(element, end=" ")
    print()
```

Ieșire

```text
1 2 3
4 5 6
7 8 9
```

Bucla exterioară parcurge fiecare **rând** (care este o listă). Bucla interioară parcurge fiecare **element** din acel rând. **print()** de la final începe o linie nouă după fiecare rând

---

Dacă avem nevoie de **indecși** (ca să știm unde suntem)

```py
matrice = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for i in range(len(matrice)):
    for j in range(len(matrice[i])):
        print(f"[{i}][{j}] = {matrice[i][j]}")
```

---

Operații frecvente pe matrice

**Suma tuturor elementelor**

```py
total = 0
for rand in matrice:
    for element in rand:
        total += element
print(total)
```

Rezultat **45**

**Găsește maximul**

```py
cel_mai_mare = matrice[0][0]
for rand in matrice:
    for element in rand:
        if element > cel_mai_mare:
            cel_mai_mare = element
print(cel_mai_mare)
```

Rezultat **9**

---

Un caz de utilizare din viața reală: imaginează-ți o hartă de joc unde 0 este gol și 1 este un zid

```py
harta_joc = [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0]
]

ziduri = 0
for rand in harta_joc:
    for celula in rand:
        if celula == 1:
            ziduri += 1
print(f"Numarul de ziduri: {ziduri}")
```

Rezultat **Numarul de ziduri: 4**

---

## Misiune: Grila de Senzori

Senzorii de pe carena stației își raportează citirile sub forma unei **grile 4×4** (o listă de liste). Controlul Misiunii vrea un rezumat rapid al grilei.

Folosind **bucle imbricate**, afișează:

1. **Suma fiecărui rând**, câte una pe linie, etichetată `Rand 1: `, `Rand 2: `, și așa mai departe (rândurile numerotate de la 1).
2. `Max: ` urmat de cea mai **mare** citire de oriunde din grilă.
3. `Peste 7: ` urmat de **câte** citiri sunt strict mai mari decât 7.

**Ieșire**

```text
Rand 1: 22
Rand 2: 26
Rand 3: 15
Rand 4: 37
Max: 10
Peste 7: 7
```
