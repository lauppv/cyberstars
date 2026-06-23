Îți amintești de **căutarea liniară**? Parcurgem lista element cu element. Pentru o listă de **1.000.000** de elemente, s-ar putea să le verificăm pe toate. Asta e lent

**Căutarea binară** este dramatic mai rapidă, dar are o cerință: lista trebuie să fie **sortată**

Ideea: ne uităm la elementul din **mijloc**. Dacă este ceea ce căutăm, perfect. Dacă ținta noastră este **mai mică**, trebuie să fie în **jumătatea stângă**. Dacă este **mai mare**, trebuie să fie în **jumătatea dreaptă**. Apoi repetăm pe jumătatea corectă

Gândește-te la o carte de telefon. Cauți „Vercetti". Nu începi de la pagina 1. Deschizi cartea aproximativ la mijloc. Dacă pagina din mijloc arată nume care încep cu „M", știi că Vercetti este în **a doua jumătate**. Deschizi la mijlocul celei de-a doua jumătăți. Și așa mai departe

```py
numere = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
tinta = 13
```

**Pasul 1**: indexul din mijloc = 4, valoarea din mijloc = 9. Este 13 > 9? Da → caută în jumătatea dreaptă

**Pasul 2**: jumătatea dreaptă este [11, 13, 15, 17, 19]. Mijloc = 15. Este 13 < 15? Da → caută în partea stângă

**Pasul 3**: partea stângă este [11, 13]. Mijloc = 11. Este 13 > 11? Da → caută la dreapta

**Pasul 4**: [13]. Am găsit-o!

Am verificat **4 elemente** în loc să le scanăm pe toate 10. Pentru 1.000.000 de elemente, căutarea binară verifică cel mult **20** — asta e magia înjumătățirii problemei la fiecare pas

---

În cod

```py
def cautare_binara(numere, tinta):
    stanga = 0
    dreapta = len(numere) - 1

    while stanga <= dreapta:
        mijloc = (stanga + dreapta) // 2

        if numere[mijloc] == tinta:
            return mijloc
        elif numere[mijloc] < tinta:
            stanga = mijloc + 1
        else:
            dreapta = mijloc - 1

    return -1

numere = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(cautare_binara(numere, 13))
print(cautare_binara(numere, 6))
```

Ieșire

```text
6
-1
```

13 este la indexul 6. 6 nu este în listă, deci returnăm -1

---

Hai să urmărim pas cu pas **cautare_binara([1,3,5,7,9,11,13,15,17,19], 13)**

- left=0, right=9, mid=4 → numere[4]=9 < 13 → left=5
- left=5, right=9, mid=7 → numere[7]=15 > 13 → right=6
- left=5, right=6, mid=5 → numere[5]=11 < 13 → left=6
- left=6, right=6, mid=6 → numere[6]=13 == 13 → **găsit la indexul 6!**

---

O putem scrie și **recursiv**

```py
def cautare_binara_recursiva(numere, tinta, stanga, dreapta):
    if stanga > dreapta:
        return -1

    mijloc = (stanga + dreapta) // 2

    if numere[mijloc] == tinta:
        return mijloc
    elif numere[mijloc] < tinta:
        return cautare_binara_recursiva(numere, tinta, mijloc + 1, dreapta)
    else:
        return cautare_binara_recursiva(numere, tinta, stanga, mijloc - 1)

numere = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(cautare_binara_recursiva(numere, 13, 0, len(numere) - 1))
```

Rezultat **6**. Aceeași logică, alt stil

---

**Cât de rapidă este căutarea binară?** Fiecare pas înjumătățește lista. Pornind de la **n** elemente: n → n/2 → n/4 → n/8 → … → 1. Câte înjumătățiri? Asta e **log₂(n)**. Pentru 1.000.000 de elemente: log₂(1.000.000) ≈ **20 de pași**. Compară asta cu cei 1.000.000 de pași ai căutării liniare. Diferența este uriașă

---

## Misiune: Căutare în Arhivă

Arhiva stației stochează ID-urile echipajului într-o listă **sortată** (deja în dreapta). Controlul Misiunii trimite un lot de interogări de căutare și are nevoie ca fiecare să primească răspuns rapid — așa că vei folosi **căutarea binară**, nu o scanare liniară.

1. Scrie o funcție **binary_search(numere, tinta)** care returnează **indexul** unde se află `tinta` în lista sortată, sau `-1` dacă nu este acolo.
2. Pentru fiecare interogare, afișează interogarea, apoi `-> index ` și indexul dacă a fost găsit, sau `-> negăsit` dacă nu.
3. Afișează `Găsite: ` urmat de câte interogări au fost localizate.

```py
ids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
interogari = [23, 50, 8, 91, 100]
```

**Ieșire**

```text
23 -> index 5
50 -> negasit
8 -> index 2
91 -> index 9
100 -> negasit
Gasite: 3
```
