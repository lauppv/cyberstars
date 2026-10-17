Listele țin lucrurile în șir: un prim element, un al doilea, un al treilea. Multe din ce întâlnești zi de zi se ramifică însă. Folderele de pe calculator conțin alte foldere, care conțin la rândul lor foldere. Un arbore genealogic se desparte la fiecare generație. Tabloul unui turneu se strânge până la un singur câștigător. Toate au aceeași formă, și ea are un nume: **arbore**

---

Iată un arbore mic de numere

```visual
{"use": "trees-terms"}
```

Fiecare număr este un **nod**, iar fiecare linie dintre două noduri este o **muchie**. În programare arborii cresc cu capul în jos: încep de sus

- **Rădăcina** este nodul de sus, de unde pornește arborele: **8**
- Un nod aflat imediat sub altul este **copilul** lui, iar cel de deasupra este **părintele** lui. **3** și **10** sunt copiii lui **8**, iar **8** este părintele lor
- Un nod fără copii este o **frunză**: **1**, **6** și **14**
- **Înălțimea** unui arbore este numărul de muchii de pe cel mai lung drum de la rădăcină în jos până la o frunză. Aici e 8 → 3 → 1 sau 8 → 10 → 14: două muchii, deci înălțimea este **2**. Un arbore care are doar rădăcina are înălțimea **0**

Fiecare nod în afară de rădăcină are exact un părinte, deci există un singur drum de la rădăcină în jos până la fiecare nod. Asta îl face arbore, și nu doar un ghem de linii

---

În acest arbore niciun nod nu are mai mult de doi copii. Un astfel de arbore este un **arbore binar**, iar cei doi copii au nume: copilul **stâng** și copilul **drept**. **10** are doar un copil drept, **14**; cel stâng lipsește

Arborii binari sunt cei pe care îi vei folosi cel mai des. Căutarea, sortarea și majoritatea problemelor din lecțiile următoare pornesc de la ei

---

Un nod trebuie să țină împreună trei lucruri: **valoarea** lui, copilul **stâng** și copilul **drept**. Python le grupează pe astfel de lucruri cu o **clasă**, un plan după care se construiește un fel de obiect. Aici obiectul este un nod

```text
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None
```

`__init__` rulează de fiecare dată când se construiește un nod, iar **self** este nodul construit. Un nod nou primește valoarea pe care i-o dai și încă niciun copil: **None** înseamnă „nimic aici”

**Nod(8)** construiește un nod care ține 8

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


radacina = Nod(8)
print(radacina.valoare)
print(radacina.stanga)
```

Rezultat

```text
8
None
```

Singur, un nod nou este o valoare cu doi copii goi

```visual
{"use": "trees-new-node"}
```

---

Un copil e doar un alt nod, pus în **stanga** sau în **dreapta**. Iată cum crește arborele de la începutul lecției, câte o linie de cod

```visual
{"use": "trees-grow"}
```

Toate la un loc, cu trei dintre noduri citite înapoi

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

print(radacina.stanga.valoare)
print(radacina.stanga.dreapta.valoare)
print(radacina.dreapta.dreapta.valoare)
```

Rezultat

```text
3
6
14
```

Citește **radacina.stanga.dreapta** câte un pas: pornești de la rădăcină, mergi la copilul ei stâng, apoi la copilul drept al acestuia. Orice nod poate fi atins așa, de la rădăcină în jos pe muchii. Programul ține într-o variabilă doar **radacina**; toate celelalte noduri atârnă de ea

Adică drumul acesta prin arbore

```visual
{"use": "trees-path"}
```

---

O frunză este un nod ai cărui doi copii sunt amândoi **None**, iar **is None** verifică exact asta

În arborele de la început, frunzele sunt 1, 6 și 14

```visual
{"use": "trees-leaves"}
```

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

frunza = radacina.stanga.stanga
if frunza.stanga is None and frunza.dreapta is None:
    print(frunza.valoare, "este o frunza")
```

Rezultat **1 este o frunza**

---

Deocamdată construiești arborii de mână, câte un nod. În lecțiile următoare vei parcurge un arbore întreg cu câteva linii de cod, oricât de mare ar fi

---

## Misiune: Construiește un arbore

Iată un arbore binar cu cinci noduri, cu o literă în locul fiecărei valori

```text
      a
     / \
    b   c
   / \
  d   e
```

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe programul cu cele cinci valori, câte o variabilă pentru fiecare literă: `a = 8`, `b = 3`, `c = 10`, `d = 1` și `e = 6`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Apoi, pornind de la rădăcină și mergând prin copiii ei, afișează trei linii
   - **Radacina:** și valoarea rădăcinii
   - **Copii:** și copiii rădăcinii, întâi cel stâng
   - **Frunze:** și frunzele, de la stânga la dreapta

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 8, b = 3, c = 10, d = 1 și e = 6

```text
Radacina: 8
Copii: 3 10
Frunze: 1 6 10
```

**Exemplu** pentru a = 50, b = 30, c = 70, d = 20 și e = 40

```text
Radacina: 50
Copii: 30 70
Frunze: 20 40 70
```
