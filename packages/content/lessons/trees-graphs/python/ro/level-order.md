Parcurgerile în adâncime se scufundă: coboară până jos pe o parte a arborelui înainte să se întoarcă după cealaltă. Uneori vrei invers. Întâi rădăcina, apoi tot ce e cu un pas sub ea, apoi tot ce e cu doi pași sub ea, cum ai citi arborele pe hârtie, rând cu rând. Asta este o **parcurgere pe niveluri**

---

Nodurile unui arbore stau pe **niveluri**. Rădăcina e pe nivelul **0**, copiii ei pe nivelul **1**, copiii lor pe nivelul **2**, și tot așa

```text
        8            nivelul 0
       / \
      3   10         nivelul 1
     / \    \
    1   6    14      nivelul 2
```

O parcurgere pe niveluri le vizitează de sus în jos și, pe fiecare nivel, de la stânga la dreapta

```text
8 3 10 1 6 14
```

Numărul ultimului nivel este înălțimea arborelui: aici **2**, același răspuns pe care l-a dat **inaltime** recursivă lecția trecută

---

Recursivitatea nu se potrivește aici. Un apel recursiv pe copilul stâng termină toată partea stângă înainte să-i vină rândul copilului drept, așa că **1** și **6** ar ieși înaintea lui **10**. Altceva trebuie să țină minte ce noduri așteaptă și să le dea mai departe în ordinea în care au fost găsite

Acesta e o **coadă**, ca rândul de la casă. Cine vine se așază la final, cine e servit pleacă din față: primul venit, primul servit

```text
vin:     Ana, apoi Ben, apoi Cris

fata [ Ana  Ben  Cris ] final

servit:  Ana iese prima, apoi Ben
```

---

Python are o coadă gata făcută, **deque**, în modulul **collections**. **append** adaugă la final, iar **popleft** ia din față

```py
from collections import deque

coada = deque()
coada.append("Ana")
coada.append("Ben")
coada.append("Cris")

print(coada.popleft())
print(coada.popleft())
print(len(coada))
```

Rezultat

```text
Ana
Ben
1
```

Ar merge și o listă obișnuită, cu **pop(0)**, dar ea mută fiecare element cu o poziție la stânga de fiecare dată când îl ia pe primul. **popleft** nu mută nimic, oricât de lungă ar fi coada

---

Acum parcurgerea propriu-zisă. Pune rădăcina în coadă. Apoi, cât timp coada nu e goală: ia nodul din față, afișează-l și pune-i copiii la final

```py
from collections import deque


class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def pe_niveluri(radacina):
    coada = deque()
    coada.append(radacina)
    while len(coada) > 0:
        nod = coada.popleft()
        print(nod.valoare, end=" ")
        if nod.stanga is not None:
            coada.append(nod.stanga)
        if nod.dreapta is not None:
            coada.append(nod.dreapta)
    print()


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

pe_niveluri(radacina)
```

Rezultat **8 3 10 1 6 14**

Iată coada după ce fiecare nod e scos și copiii lui sunt puși în ea. Copiii se așază mereu în spatele a tot ce așteaptă deja, așa că un nivel întreg iese din coadă înainte să înceapă următorul

```text
scos   afisat  coada dupa
               [8]
8      8       [3, 10]
3      3       [10, 1, 6]
10     10      [1, 6, 14]
1      1       [6, 14]
6      6       [14]
14     14      []
```

Cele două linii cu **if** țin copiii lipsă departe de coadă: când copilul este **None**, nu există niciun nod de scos mai târziu

---

Ca să afișezi fiecare nivel pe linia lui, observă ce ține coada când începe un nivel: exact nodurile acelui nivel, și nimic altceva

```text
incepe nivelul 0    [8]
incepe nivelul 1    [3, 10]
incepe nivelul 2    [1, 6, 14]
```

Așa că numără-le întâi cu **len(coada)** și scoate exact atâtea. Copiii pe care îi pun ei așteaptă runda următoare

```py
from collections import deque


class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def afiseaza_niveluri(radacina):
    coada = deque()
    coada.append(radacina)
    nivel = 0
    while len(coada) > 0:
        marime = len(coada)
        print(f"Nivelul {nivel}:", end=" ")
        for i in range(marime):
            nod = coada.popleft()
            print(nod.valoare, end=" ")
            if nod.stanga is not None:
                coada.append(nod.stanga)
            if nod.dreapta is not None:
                coada.append(nod.dreapta)
        print()
        nivel += 1


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

afiseaza_niveluri(radacina)
```

Rezultat

```text
Nivelul 0: 8
Nivelul 1: 3 10
Nivelul 2: 1 6 14
```

---

Mergând nivel cu nivel, parcurgerea ajunge la fiecare nod apropiat de rădăcină înaintea oricărui nod mai îndepărtat. De aceea parcurgerea aceasta, numită în general **în lățime**, revine în lecțiile despre grafuri: găsește cel mai scurt drum dintr-un loc în altul

---

## Misiune: Citește un arbore pe niveluri

Iată un arbore binar cu șapte noduri, cu o literă în locul fiecărei valori

```text
        a
       / \
      b   c
     /   / \
    d   e   f
         \
          g
```

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe programul cu cele șapte valori, câte o variabilă pentru fiecare literă, de la `a` la `g`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Parcurge-l nivel cu nivel folosind o coadă și afișează câte o linie pe nivel: **Nivelul**, numărul nivelului, două puncte și valorile de pe acel nivel, de la stânga la dreapta

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 și g = 7

```text
Nivelul 0: 1
Nivelul 1: 2 3
Nivelul 2: 4 5 6
Nivelul 3: 7
```

**Exemplu** pentru a = 40, b = 20, c = 60, d = 10, e = 50, f = 70 și g = 55

```text
Nivelul 0: 40
Nivelul 1: 20 60
Nivelul 2: 10 50 70
Nivelul 3: 55
```
