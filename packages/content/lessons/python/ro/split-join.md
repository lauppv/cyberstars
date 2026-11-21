Textul vine des ca o singură linie lungă: o listă de nume, un rând de numere, o propoziție. Două metode pe string-uri ne ajută să lucrăm cu el: `split()` taie un string într-o listă, iar `join()` lipește o listă la loc într-un string

---

`split()` taie un string acolo unde găsește spații și ne dă înapoi o listă cu bucățile

```py
propozitie = "mergem pe luna maine"
cuvinte = propozitie.split()
print(cuvinte)
print(len(cuvinte))
```

Rezultat

```text
['mergem', 'pe', 'luna', 'maine']
4
```

`len(cuvinte)` ne spune câte cuvinte are propoziția. Chiar dacă între cuvinte sunt două sau trei spații, `split()` fără nimic între paranteze găsește tot doar cuvintele

---

Putem să îi spunem lui `split()` unde să taie. Datele vin des cu virgule între valori

```py
linie = "Mercur,Venus,Pamant,Marte"
planete = linie.split(",")
for planeta in planete:
    print(planeta)
```

Rezultat

```text
Mercur
Venus
Pamant
Marte
```

Virgula a dispărut: `split(",")` taie la fiecare virgulă și o aruncă. Rezultatul e o listă obișnuită, așa că putem să o parcurgem, să citim `planete[0]` sau să folosim `append`

---

`join()` face invers. Scriem întâi lipiciul, apoi `.join()` cu lista înăuntru

```py
planete = ["Mercur", "Venus", "Pamant"]
print(" - ".join(planete))
print("".join(planete))
```

Rezultat

```text
Mercur - Venus - Pamant
MercurVenusPamant
```

Lipiciul se pune între elemente, niciodată înaintea primului sau după ultimul. Cu un string gol `""` drept lipici, elementele se lipesc unul de altul

`join()` merge doar pe o listă de string-uri. O listă de numere trebuie să devină întâi string-uri, de exemplu cu `str()` într-o buclă

---

Împreună schimbă un format în altul. Aici transformăm o linie cu virgule într-o linie cu bare oblice și facem fiecare nume cu majuscule pe drum

```py
linie = "ada,alan,grace"
nume = linie.split(",")
tare = []
for n in nume:
    tare.append(n.upper())
print(" / ".join(tare))
```

Rezultat

```text
ADA / ALAN / GRACE
```

---

## Misiune: Ecusoanele echipajului

Calculatorul stației trimite lista echipajului pe o singură linie: numele sunt despărțite prin virgule, iar fiecare nume e un prenume și un nume de familie, cu litere mici

1. Începe programul cu o variabilă **echipaj**, un string. De exemplu `echipaj = "ada lovelace,alan turing,grace hopper"`
2. Afișează `Persoane: ` și câte persoane sunt în echipaj
3. Afișează `Ecusoane: ` și inițialele fiecărei persoane cu majuscule, unite cu `-`
4. Afișează `Nume de familie: ` și toate numele de familie, unite cu `, `

**echipaj** are între 1 și 10 persoane. Fiecare nume are două cuvinte cu un spațiu între ele, iar în jurul virgulelor nu sunt spații

**Exemplu** pentru echipaj = "ada lovelace,alan turing,grace hopper"

```text
Persoane: 3
Ecusoane: AL-AT-GH
Nume de familie: lovelace, turing, hopper
```

**Exemplu** pentru echipaj = "sally ride"

```text
Persoane: 1
Ecusoane: SR
Nume de familie: ride
```
