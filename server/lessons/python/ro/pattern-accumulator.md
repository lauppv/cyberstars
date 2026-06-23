Tiparul **contor** numără **câte** lucruri îndeplinesc o condiție. Tiparul **acumulator** este vărul său: în loc să numărăm, **construim** un rezultat. Poate fi o sumă, un produs, un șir sau o listă

Am văzut deja cel mai simplu acumulator când am adunat prețurile

```py
preturi = [10, 20, 30, 40]
total = 0
for pret in preturi:
    total += pret
print(total)
```

Rezultat **100**. Am **acumulat** suma pas cu pas

---

Dar acumulatoarele nu sunt doar pentru numere. Putem construi **șiruri**

```py
cuvinte = ["Vice", "City", "Stories"]
propozitie = ""
for cuvant in cuvinte:
    propozitie += cuvant + " "
print(propozitie)
```

Rezultat **Vice City Stories**

Sau putem construi o **listă nouă** pornind de la una existentă

```py
numere = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pare = []
for n in numere:
    if n % 2 == 0:
        pare.append(n)
print(pare)
```

Rezultat **[2, 4, 6, 8, 10]**

Tiparul este mereu:

1. **Inițializează** acumulatorul (0 pentru sumă, "" pentru șir, [] pentru listă)
2. **Parcurge** datele cu o buclă
3. **Adaugă** la acumulator la fiecare iterație (sau la unele iterații)

---

Un exemplu amuzant: hai să construim un șir **inversat**

```py
original = "Tommy"
sir_inversat = ""
for caracter in original:
    sir_inversat = caracter + sir_inversat
print(sir_inversat)
```

Rezultat **ymmoT**

Cum funcționează asta? Fiecare caracter nou ajunge la **început** în loc de la sfârșit. Prima iterație: **"T"**. A doua: **"oT"**. A treia: **"moT"**. Și așa mai departe. Gândește-te puțin, e un truc frumos

---

Alt exemplu: **produsul** tuturor numerelor dintr-o listă

```py
numere = [2, 3, 4, 5]
produs = 1
for n in numere:
    produs *= n
print(produs)
```

Rezultat **120** (2 × 3 × 4 × 5). Observă că pornim de la **1**, nu de la **0**. De ce? Pentru că înmulțirea cu 0 ne-ar da 0 pentru totdeauna. Valoarea de pornire depinde de operație: **0** pentru sumă, **1** pentru produs, **""** pentru șiruri, **[]** pentru liste

---

## Misiune: Acumulator de Semnal

Ai o listă de intensități de semnal `puncte_tari` și un cuvânt `cod` (ambele în dreapta). Folosind **tiparul acumulator** pentru fiecare pas:

1. `Sumă: ` apoi totalul tuturor intensităților (acumulează de la `0`)
2. `Puternice: ` apoi o **listă** doar cu intensitățile **peste 50** (acumulează într-o listă goală `[]`)
3. `Inversat: ` apoi cuvântul code inversat **caracter cu caracter** (acumulează într-un șir gol `""`, punând fiecare caracter nou în **față**)

**Ieșire**

```text
Suma: 255
Puternice: [65, 90]
Inversat: TIBRO
```
