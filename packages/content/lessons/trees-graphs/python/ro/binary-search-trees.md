Ca să găsești o valoare într-unul dintre arborii de până acum, trebuie să te uiți la fiecare nod: poate fi oriunde. Un **arbore binar de căutare** își ține valorile într-o ordine care îți spune încotro să mergi, așa că o căutare sare peste părți întregi din arbore fără să se uite la ele

---

Regula privește fiecare nod, nu doar rădăcina: tot ce e în partea lui **stângă** este **mai mic** decât el, iar tot ce e în partea lui **dreaptă** este **mai mare**

Arborele din lecțiile trecute o respectă

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

- În stânga lui **8** sunt 3, 1 și 6, toate mai mici. În dreapta lui sunt 10 și 14, amândouă mai mari
- În stânga lui **3** este 1, mai mic. În dreapta lui este 6, mai mare, și totuși mai mic decât 8, pentru că stă în partea stângă a lui 8
- În dreapta lui **10** este 14, mai mare

De aceea parcurgerea în inordine l-a afișat sortat: inordinea afișează tot ce e mai mic decât un nod, apoi nodul, apoi tot ce e mai mare

În lecția aceasta valorile dintr-un arbore sunt toate diferite, așa că regula nu trebuie să spună niciodată unde merge o valoare egală

---

**Căutarea** urmează un singur drum în jos. La fiecare nod, compară valoarea pe care o vrei cu a nodului. Egale: ai găsit-o. Mai mică: poate fi doar în partea stângă. Mai mare: doar în partea dreaptă. Dacă drumul se termină, la **None**, valoarea nu e în arbore

Căutarea lui **6**

```visual
{"use": "bst-search-6"}
```

Căutarea lui **12**

```visual
{"use": "bst-search-12"}
```

Trei noduri verificate, din șase. Fiecare pas în jos lasă în urmă o parte întreagă a arborelui

Ca funcție recursivă, sunt aceleași trei întrebări, plus cazul de bază pentru un drum care s-a terminat

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def cauta(nod, cautat):
    if nod is None:
        return False
    if cautat == nod.valoare:
        return True
    if cautat < nod.valoare:
        return cauta(nod.stanga, cautat)
    return cauta(nod.dreapta, cautat)


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

print(cauta(radacina, 6))
print(cauta(radacina, 12))
```

Rezultat

```text
True
False
```

---

**Inserarea** merge pe același drum pe care ar merge o căutare. Acolo unde drumul se termină, la **None**, este exact locul unde îi e locul noii valori, deci acolo merge nodul ei

```text
def insereaza(nod, valoare):
    if nod is None:
        return Nod(valoare)
    if valoare < nod.valoare:
        nod.stanga = insereaza(nod.stanga, valoare)
    else:
        nod.dreapta = insereaza(nod.dreapta, valoare)
    return nod
```

**insereaza** dă înapoi nodul pe care a fost apelată, cu noua valoare undeva sub el. Doar jos de tot, unde a fost apelată pe **None**, dă înapoi un nod nou-nouț, iar părintele de un nivel mai sus îl păstrează în **stanga** sau în **dreapta**

Un arbore gol este **None**, iar inserarea în el face rădăcina. Iată arborele din lecție crescând din valorile 8, 3, 10, 1, 6 și 14, inserate în ordinea asta

```visual
{"use": "bst-insert"}
```

Totul la un loc, cu o parcurgere în inordine ca să-l citim înapoi

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def insereaza(nod, valoare):
    if nod is None:
        return Nod(valoare)
    if valoare < nod.valoare:
        nod.stanga = insereaza(nod.stanga, valoare)
    else:
        nod.dreapta = insereaza(nod.dreapta, valoare)
    return nod


def inordine(nod):
    if nod is None:
        return
    inordine(nod.stanga)
    print(nod.valoare, end=" ")
    inordine(nod.dreapta)


radacina = None
for valoare in [8, 3, 10, 1, 6, 14]:
    radacina = insereaza(radacina, valoare)

inordine(radacina)
print()
```

Rezultat **1 3 6 8 10 14**

Valorile au intrat amestecate și au ieșit sortate. Un arbore binar de căutare e încă un mod de a sorta

---

Ordinea în care intră valorile hotărăște forma arborelui. Inserează aceleași cinci valori în două ordini

```text
3, 1, 4, 2, 5              1, 2, 3, 4, 5

      3                    1
     / \                    \
    1   4                    2
     \   \                    \
      2   5                    3
                                \
                                 4
                                  \
                                   5
```

În stânga, un arbore de înălțime 2. În dreapta, intrarea sortată a făcut fiecare valoare mai mare decât cea dinainte, așa că fiecare a mers la dreapta, iar arborele e o linie de înălțime 4. O căutare a lui 5 vizitează acolo fiecare nod, nu mai repede decât parcurgerea unei liste

Înălțimea este cât costă o căutare: un nod verificat pe fiecare nivel. Deci un arbore e rapid doar cât timp rămâne stufos și scund. Există arbori binari de căutare care se reechilibrează singuri pe măsură ce primesc valori, ca să nu devină niciodată o linie, cum sunt arborii **AVL** și **roșu-negru**; ei pornesc de la tot ce e în lecția aceasta

---

## Misiune: Crește un arbore de căutare

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe programul cu două variabile: **valori**, o listă de numere întregi, și **cautat**, un număr întreg. De exemplu `valori = [50, 30, 70, 20, 40, 60, 80]` și `cautat = 60`
3. Pornind de la un arbore gol, inserează valorile într-un arbore binar de căutare, una câte una, în ordinea din listă
4. Apoi, cu funcții recursive, afișează trei linii
   - **Sortat:** și valorile din arbore, dintr-o parcurgere în inordine
   - **Inaltime:** și înălțimea arborelui
   - **Cautare**, valoarea căutată, două puncte și **gasit** dacă valoarea e în arbore, sau **negasit** dacă nu e. Găsește-o căutând în arbore, nu în listă

**valori** are între 1 și 7 numere, toate diferite, iar fiecare număr, inclusiv cel căutat, este de la -1000 la 1000

**Exemplu** pentru valori = [50, 30, 70, 20, 40, 60, 80] și cautat = 60

```text
Sortat: 20 30 40 50 60 70 80
Inaltime: 2
Cautare 60: gasit
```

**Exemplu** pentru valori = [1, 2, 3, 4, 5] și cautat = 6

```text
Sortat: 1 2 3 4 5
Inaltime: 4
Cautare 6: negasit
```
