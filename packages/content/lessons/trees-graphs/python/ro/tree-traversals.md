Lecția trecută ai construit un arbore de mână și i-ai citit nodurile câte un drum: **radacina.stanga.dreapta**. Merge pentru cinci noduri. Un arbore adevărat poate ține mii de noduri, iar forma lui nu o știi dinainte. Ai nevoie de un mod de a vizita fiecare nod, oricum ar arăta arborele, cu câteva linii de cod

Modul acesta este **recursivitatea**

---

O recapitulare scurtă, în caz că a trecut ceva vreme. O funcție **recursivă** este o funcție care se apelează pe ea însăși. Fiecare apel lucrează pe o bucată mai mică a problemei, până când bucata e atât de mică încât răspunsul e evident: acela e **cazul de bază**, iar acolo funcția nu se mai apelează

```py
def numaratoare(n):
    if n == 0:
        print("Start!")
        return
    print(n)
    numaratoare(n - 1)


numaratoare(3)
```

Rezultat

```text
3
2
1
Start!
```

**numaratoare(3)** afișează 3 și lasă restul treabei lui **numaratoare(2)**, care o lasă lui **numaratoare(1)**, și tot așa până la **numaratoare(0)**, cazul de bază. Fără acel **if**, apelurile nu s-ar opri niciodată

---

Acum privește din nou un arbore

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Acoperă rădăcina cu mâna. Ce rămâne sunt doi arbori mai mici: unul care pornește de la **3**, altul care pornește de la **10**. Fiecare dintre ei e o rădăcină cu doi arbori mai mici sub ea, și tot așa, până la frunze

```text
      3        10
     / \         \
    1   6         14
```

Deci un arbore este o rădăcină plus doi arbori mai mici. Exact forma care îi place recursivității: ca să faci ceva cu un arbore, fă-l cu rădăcina și lasă aceeași funcție să se ocupe de cei doi arbori mai mici. Cazul de bază este arborele gol, **None**: acolo nu e nimic de făcut

---

Iată toată ideea în patru linii. **arata** afișează fiecare valoare din arbore

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def arata(nod):
    if nod is None:
        return
    print(nod.valoare)
    arata(nod.stanga)
    arata(nod.dreapta)


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

arata(radacina)
```

Rezultat

```text
8
3
1
6
10
14
```

**arata(radacina)** afișează 8, apoi apelează **arata** pe copilul stâng, care afișează 3 și coboară din nou. Când ajunge la un copil care lipsește, **nod is None** îl trimite imediat înapoi sus, iar parcurgerea continuă de unde rămăsese. Nimic din **arata** nu știe cât de mare e arborele: aceleași patru linii merg pentru orice arbore

---

**arata** a făcut trei lucruri la fiecare nod: afișează nodul, parcurge partea stângă, parcurge partea dreaptă. Schimbă ordinea celor trei linii și obții altă parcurgere. Fiecare ordine are un nume, iar împreună sunt **parcurgerile în adâncime**: fiecare coboară până jos pe o parte înainte să se întoarcă după cealaltă

**Preordine:** întâi nodul, apoi partea lui stângă, apoi partea dreaptă

```text
def preordine(nod):
    if nod is None:
        return
    print(nod.valoare, end=" ")
    preordine(nod.stanga)
    preordine(nod.dreapta)
```

Asta e parcurgerea pe care a făcut-o **arata**

```visual
{"use": "traversals-preorder"}
```

**Inordine:** întâi partea stângă, apoi nodul, apoi partea dreaptă

```text
def inordine(nod):
    if nod is None:
        return
    inordine(nod.stanga)
    print(nod.valoare, end=" ")
    inordine(nod.dreapta)
```

```visual
{"use": "traversals-inorder"}
```

Uită-te la ordine: numerele au ieșit sortate. Aici nu e o întâmplare, iar lecția despre arbori binari de căutare îți va arăta de ce

**Postordine:** partea stângă, apoi partea dreaptă, iar nodul la final

```text
def postordine(nod):
    if nod is None:
        return
    postordine(nod.stanga)
    postordine(nod.dreapta)
    print(nod.valoare, end=" ")
```

```visual
{"use": "traversals-postorder"}
```

Un nod e afișat abia după tot ce se află sub el. E ordinea de folosit când copiii trebuie tratați înaintea părintelui, ca la ștergerea unui folder: întâi pleacă fișierele lui

---

Toate trei pe același arbore. **end=" "** ține valorile pe o singură linie, iar **print()** gol o încheie

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def preordine(nod):
    if nod is None:
        return
    print(nod.valoare, end=" ")
    preordine(nod.stanga)
    preordine(nod.dreapta)


def inordine(nod):
    if nod is None:
        return
    inordine(nod.stanga)
    print(nod.valoare, end=" ")
    inordine(nod.dreapta)


def postordine(nod):
    if nod is None:
        return
    postordine(nod.stanga)
    postordine(nod.dreapta)
    print(nod.valoare, end=" ")


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

preordine(radacina)
print()
inordine(radacina)
print()
postordine(radacina)
print()
```

Rezultat

```text
8 3 1 6 10 14
1 3 6 8 10 14
1 6 3 14 10 8
```

---

O funcție recursivă poate și să **returneze** ceva despre arbore. **Înălțimea** este numărul de muchii de pe cel mai lung drum în jos de la rădăcină. Gândește-o recursiv: arborele este rădăcina deasupra celor doi arbori mai mici, deci înălțimea lui este cu o muchie mai mare decât a celui mai înalt dintre cei doi

```text
inaltime(8) = 1 + cea mai mare dintre inaltime(3) si inaltime(10)
```

Cazul de bază cere atenție. O singură frunză are înălțimea 0 și se află cu o muchie deasupra celor doi copii lipsă. Așa că un arbore gol contează ca **-1**: atunci o frunză primește 1 + (-1) = 0, cum trebuie

```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def inaltime(nod):
    if nod is None:
        return -1
    return 1 + max(inaltime(nod.stanga), inaltime(nod.dreapta))


radacina = Nod(8)
radacina.stanga = Nod(3)
radacina.dreapta = Nod(10)
radacina.stanga.stanga = Nod(1)
radacina.stanga.dreapta = Nod(6)
radacina.dreapta.dreapta = Nod(14)

print(inaltime(radacina))
print(inaltime(radacina.dreapta))
print(inaltime(radacina.stanga.stanga))
```

Rezultat

```text
2
1
0
```

Urmărește-o de jos în sus, cu răspunsul fiecărui nod în paranteze. Fiecare frunză răspunde 0. **10** răspunde 1 + max(-1, 0) = 1, la fel și **3**. Rădăcina răspunde 1 + max(1, 1) = **2**

```text
          8 (2)
         / \
    (1) 3   10 (1)
       / \    \
  (0) 1   6    14 (0)
         (0)
```

---

Același tipar numără nodurile, adună valorile sau găsește cea mai mare valoare. Hotărăște ce răspunde arborele gol, apoi construiește răspunsul unui nod din răspunsurile celor doi copii ai lui

```text
def numara(nod):
    if nod is None:
        return 0
    return 1 + numara(nod.stanga) + numara(nod.dreapta)
```

---

## Misiune: Parcurge un arbore

Iată un arbore binar cu șapte noduri, cu o literă în locul fiecărei valori

```text
        a
       / \
      b   c
     / \   \
    d   e   f
       /
      g
```

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe programul cu cele șapte valori, câte o variabilă pentru fiecare literă, de la `a` la `g`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Scrie câte o funcție recursivă pentru fiecare dintre cele trei parcurgeri în adâncime și folosește-le ca să afișezi trei linii
   - **Preordine:** și valorile în preordine
   - **Inordine:** și valorile în inordine
   - **Postordine:** și valorile în postordine

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 și g = 7

```text
Preordine: 1 2 4 5 7 3 6
Inordine: 4 2 7 5 1 3 6
Postordine: 4 7 5 2 6 3 1
```

**Exemplu** pentru a = 50, b = 30, c = 70, d = 20, e = 40, f = 80 și g = 35

```text
Preordine: 50 30 20 40 35 70 80
Inordine: 20 30 35 40 50 70 80
Postordine: 20 35 40 30 80 70 50
```
