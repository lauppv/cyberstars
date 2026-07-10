Știm că **sorted()** ne sortează o listă. Dar cum funcționează de fapt sortarea? Ce face calculatorul în culise? Înțelegerea algoritmilor de sortare ne învață cum să ne gândim la **eficiență** și **logică**

Cel mai simplu algoritm de sortare este **Bubble Sort**. Iată ideea: parcurgem lista și comparăm elementele **vecine**. Dacă cel din stânga este mai mare decât cel din dreapta, le **interschimbăm**. Continuăm să facem asta până când lista este sortată

```py
numere = [5, 3, 8, 1, 2]
```

**Trecerea 1**: compară vecinii, interschimbă dacă e nevoie

- Compară 5 și 3 → 5 > 3, interschimbă → **[3, 5, 8, 1, 2]**
- Compară 5 și 8 → 5 < 8, ok → **[3, 5, 8, 1, 2]**
- Compară 8 și 1 → 8 > 1, interschimbă → **[3, 5, 1, 8, 2]**
- Compară 8 și 2 → 8 > 2, interschimbă → **[3, 5, 1, 2, 8]**

După trecerea 1, **cel mai mare număr (8)** a „urcat ca o bulă" la sfârșit. De aceea se numește **Bubble Sort**

**Trecerea 2**:

- 3 și 5 → ok
- 5 și 1 → interschimbă → **[3, 1, 5, 2, 8]**
- 5 și 2 → interschimbă → **[3, 1, 2, 5, 8]**

**Trecerea 3**:

- 3 și 1 → interschimbă → **[1, 3, 2, 5, 8]**
- 3 și 2 → interschimbă → **[1, 2, 3, 5, 8]**

**Gata!** Lista este sortată

---

În cod

```py
numere = [5, 3, 8, 1, 2]

for i in range(len(numere)):
    for j in range(len(numere) - 1):
        if numere[j] > numere[j + 1]:
            numere[j], numere[j + 1] = numere[j + 1], numere[j]

print(numere)
```

Rezultat **[1, 2, 3, 5, 8]**

Trucul **numere[j], numere[j + 1] = numere[j + 1], numere[j]** este modul lui Python de a **interschimba** două variabile. În alte limbaje ai avea nevoie de o variabilă temporară, dar Python o face ușor

---

Hai să urmărim pas cu pas ca să ne asigurăm că înțelegem cele două bucle

**Bucla exterioară** (i) controlează câte treceri facem. Avem nevoie de cel mult **n** treceri, unde n este lungimea listei

**Bucla interioară** (j) parcurge lista și compară vecinii. **j** merge până la **len(numere) - 1** pentru că îl comparăm pe **j** cu **j + 1**, și nu vrem să ieșim din limite

---

**Este Bubble Sort rapid?** Sincer, nu. Pentru o listă de **n** elemente, face aproximativ **n × n** comparații. Pentru 10 elemente, asta înseamnă aproximativ 100 de comparații — în regulă. Pentru 1.000.000 de elemente, asta înseamnă aproximativ 1.000.000.000.000 de comparații — foarte lent

De aceea, în codul real folosim **sorted()**, care folosește un algoritm mult mai rapid. Dar înțelegerea Bubble Sort ne învață cum să ne gândim la **comparații** și **interschimbări**, care sunt fundamentul multor algoritmi

---

## Misiune: Calibrarea Reactorului

Reactoarele stației raportează valorile puterii într-o ordine aleatorie. Inginerii au nevoie ca acestea să fie aliniate de la cea mai mică la cea mai mare ca să observe dintr-o privire cel mai slab reactor.

Scrie o funcție **sortare_bule(numere)** care sortează o listă în ordine **crescătoare** folosind bubble sort și **returnează** lista sortată.

Apoi sortează cele două loturi de valori (`lot1` și `lot2`, deja în starter) și afișează fiecare rezultat.

```py
lot1 = [42, 17, 88, 9, 23]
lot2 = [5, 4, 3, 2, 1]
print(sortare_bule(lot1))
print(sortare_bule(lot2))
```

**Ieșire**

```text
[9, 17, 23, 42, 88]
[1, 2, 3, 4, 5]
```
