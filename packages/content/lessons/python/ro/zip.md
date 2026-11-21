În lecția Funcții încorporate am folosit `zip()` ca să mergem prin două liste una lângă alta. Acum mergem mai departe: mai mult de două liste, liste de lungimi diferite și o listă lângă ea însăși

---

`zip()` ia primul element din fiecare listă, apoi al doilea din fiecare și tot așa. Merge și cu trei liste sau mai multe

```py
nume = ["Ada", "Alan", "Grace"]
varste = [36, 41, 85]
orase = ["Londra", "Manchester", "New York"]
for n, varsta, oras in zip(nume, varste, orase):
    print(f"{n}, {varsta}, {oras}")
```

Rezultat

```text
Ada, 36, Londra
Alan, 41, Manchester
Grace, 85, New York
```

La fiecare pas al buclei primim câte un element din fiecare listă, așa că avem nevoie de atâtea variabile câte liste sunt

---

Când listele nu au aceeași lungime, `zip()` se oprește la finalul celei mai scurte. Elementele în plus sunt lăsate deoparte, fără nicio eroare

```py
planete = ["Mercur", "Venus", "Pamant", "Marte"]
luni = [0, 0, 1]
for planeta, numar in zip(planete, luni):
    print(planeta, numar)
```

Rezultat

```text
Mercur 0
Venus 0
Pamant 1
```

Marte lipsește, pentru că `luni` are doar trei elemente. Atenție: dacă o listă e mai scurtă din greșeală, `zip()` nu ne spune

---

Două liste pot deveni un dicționar: una dă cheile, cealaltă valorile

```py
coduri = ["MER", "VEN", "PAM"]
nume = ["Mercur", "Venus", "Pamant"]
planete = dict(zip(coduri, nume))
print(planete["VEN"])
```

Rezultat

```text
Venus
```

---

Un truc frumos: punem în `zip()` o listă lângă ea însăși mutată cu un loc. Atunci fiecare pas al buclei primește un element și pe cel de după el

```py
inaltimi = [100, 140, 130, 190]
for inainte, dupa in zip(inaltimi, inaltimi[1:]):
    print(inainte, "->", dupa, "schimbare", dupa - inainte)
```

Rezultat

```text
100 -> 140 schimbare 40
140 -> 130 schimbare -10
130 -> 190 schimbare 60
```

`inaltimi[1:]` e lista fără primul element, deci e cu unul mai scurtă. De asta `zip()` se oprește cu un pas mai devreme, exact ce vrem: ultimul element nu are nimic după el

---

`zip()` și `enumerate()` merg bine împreună. `enumerate()` dă un număr și un element, iar aici elementul e o pereche din `zip()`. Parantezele din jurul celor două nume prind perechea

```py
nume = ["Ada", "Alan"]
varste = [36, 41]
for numar, (n, varsta) in enumerate(zip(nume, varste), start=1):
    print(numar, n, varsta)
```

Rezultat

```text
1 Ada 36
2 Alan 41
```

---

## Misiune: Cel mai mare progres

Antrenorii echipei de fotbal a stației testează fiecare jucător de două ori: o dată la începutul lunii și o dată la final. Vor să vadă schimbarea fiecărui jucător și cine a progresat cel mai mult

1. Începe programul cu trei variabile: **nume**, o listă de string-uri, și **inainte** și **dupa**, două liste de numere întregi: punctajele jucătorilor, în aceeași ordine ca numele. De exemplu `nume = ["Kai", "Mila", "Tom"]`, `inainte = [60, 75, 80]` și `dupa = [72, 70, 95]`
2. Pentru fiecare jucător, afișează numele, `: `, punctajul de dinainte, `->` cu câte un spațiu de fiecare parte, punctajul de după și schimbarea între paranteze, cu un `+` în față când nu e negativă
3. Afișează `Cel mai mare progres: ` și numele jucătorului cu cea mai mare schimbare. Dacă doi jucători au aceeași schimbare, cea mai mare, afișează-l pe cel care vine primul

Folosește `zip()`, nu `range()`. Cele trei liste au aceeași lungime, între 1 și 20 de jucători, iar fiecare punctaj e de la 0 la 100

**Exemplu** pentru nume = ["Kai", "Mila", "Tom"], inainte = [60, 75, 80] și dupa = [72, 70, 95]

```text
Kai: 60 -> 72 (+12)
Mila: 75 -> 70 (-5)
Tom: 80 -> 95 (+15)
Cel mai mare progres: Tom
```

O schimbare de 0 se scrie `+0`
