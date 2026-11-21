Erorile lui Python sunt clase: `ValueError`, `TypeError`, toate moștenesc dintr-o clasă numită `Exception`. Așa că ne putem face propriile erori, cu nume care spun exact ce a mers prost în programul nostru

---

O eroare a noastră e o clasă care moștenește din `Exception`. De multe ori nu are nevoie de nimic altceva, așa că are doar `pass`

```py
class CombustibilInsuficient(Exception):
    pass

def lanseaza(combustibil):
    if combustibil < 100:
        raise CombustibilInsuficient(f"trebuie 100, avem {combustibil}")
    return "lansat"

try:
    lanseaza(40)
except CombustibilInsuficient as e:
    print("Nicio lansare:", e)
```

Rezultat

```text
Nicio lansare: trebuie 100, avem 40
```

Numele îi spune cititorului ce s-a întâmplat chiar înainte să citească mesajul. Iar `except CombustibilInsuficient` prinde doar problema asta, nu vreun alt `ValueError` venit de altundeva

---

Erorile noastre pot avea o familie, ca orice clase. O eroare părinte pentru tot programul și copii pentru fiecare problemă. Dacă prinzi părintele, îi prinzi pe toți copiii

```py
class EroareStatie(Exception):
    pass

class CombustibilInsuficient(EroareStatie):
    pass

class DocInchis(EroareStatie):
    pass

for problema in [CombustibilInsuficient("combustibil putin"), DocInchis("docul 2 e inchis")]:
    try:
        raise problema
    except EroareStatie as e:
        print(type(e).__name__, "-", e)
```

Rezultat

```text
CombustibilInsuficient - combustibil putin
DocInchis - docul 2 e inchis
```

`type(e).__name__` e numele clasei erorii

---

Când sunt mai multe blocuri `except`, Python îl folosește pe primul care se potrivește, de sus. Așa că pune întâi cazurile speciale și la final pe cel general

```py
class EroareStatie(Exception):
    pass

class CombustibilInsuficient(EroareStatie):
    pass

try:
    raise CombustibilInsuficient("combustibil putin")
except CombustibilInsuficient:
    print("trimite o cisterna")
except EroareStatie:
    print("cheama capitanul")
```

Rezultat

```text
trimite o cisterna
```

---

O eroare poate duce și date. Dă-i un `__init__` care păstrează datele și trimite mesajul la `__init__`-ul lui `Exception` cu `super()`

```py
class CombustibilInsuficient(Exception):
    def __init__(self, lipsa):
        super().__init__(f"lipsesc {lipsa}")
        self.lipsa = lipsa

try:
    raise CombustibilInsuficient(25)
except CombustibilInsuficient as e:
    print(e)
    print(e.lipsa + 10)
```

Rezultat

```text
lipsesc 25
35
```

Codul care o prinde poate folosi `e.lipsa` ca număr, nu doar să citească mesajul

---

## Misiune: Ghișeul de combustibil

Navele cer combustibil de la stație, o cerere după alta. Ghișeul de combustibil servește o cerere când poate și spune clar de ce când nu poate

1. Scrie o clasă **EroareStatie** care moștenește din `Exception` și două clase care moștenesc din ea: **NavaNecunoscuta** și **CombustibilInsuficient**. `CombustibilInsuficient` primește cantitatea care lipsește, o păstrează ca `lipsa` și are mesajul `lipsesc` și cantitatea care lipsește
2. Scrie o funcție **alimenteaza(nume, cantitate, stoc, cunoscute)** care aruncă `NavaNecunoscuta` cu mesajul `nava necunoscuta` dacă numele nu e în lista `cunoscute`, aruncă `CombustibilInsuficient` dacă cantitatea e mai mare decât stocul și altfel returnează stocul rămas după alimentare
3. Începe programul cu trei variabile: **stoc**, un număr întreg, **cunoscute**, o listă de nume de nave, și **cereri**, o listă de string-uri, fiecare un nume și o cantitate, ca `"Speranta 40"`. De exemplu `stoc = 100`, `cunoscute = ["Speranta", "Fulger"]` și `cereri = ["Speranta 40", "Bob 10", "Fulger 80", "Fulger 50"]`
4. Pentru fiecare cerere, apelează `alimenteaza()`. Afișează numele, `: a primit ` și cantitatea când merge. Când e aruncată `CombustibilInsuficient`, afișează numele, `: ` și mesajul ei. Când e aruncată orice altă `EroareStatie`, afișează numele, `: refuzat, ` și mesajul ei
5. Afișează `Ramas: ` și stocul, și `Lipsa in total: ` și cantitățile lipsă ale tuturor erorilor `CombustibilInsuficient` adunate

**stoc** e de la 0 la 1000, cantitățile sunt de la 1 la 500 și sunt între 1 și 10 cereri

**Exemplu** pentru valorile de mai sus

```text
Speranta: a primit 40
Bob: refuzat, nava necunoscuta
Fulger: lipsesc 20
Fulger: a primit 50
Ramas: 10
Lipsa in total: 20
```
