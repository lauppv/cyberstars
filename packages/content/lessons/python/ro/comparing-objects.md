Două numere se pot compara cu `==` și `<`. Două obiecte de-ale noastre nu, nu într-un fel util: Python nu știe ce face două nave egale sau una mai mică decât cealaltă. Metodele `__eq__` și `__lt__` îi spun

---

Fără `__eq__`, `==` verifică doar dacă două nume arată spre exact același obiect. Două obiecte cu aceleași date sunt tot „diferite”

```py
class Punct:
    def __init__(self, x, y):
        self.x = x
        self.y = y

a = Punct(1, 2)
b = Punct(1, 2)
print(a == b)
print(a == a)
```

Rezultat

```text
False
True
```

---

`__eq__(self, other)` decide ce înseamnă „egal”. Primește celălalt obiect și returnează True sau False

```py
class Punct:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

print(Punct(1, 2) == Punct(1, 2))
print(Punct(1, 2) != Punct(3, 2))
print(Punct(1, 2) in [Punct(0, 0), Punct(1, 2)])
```

Rezultat

```text
True
True
True
```

Și `!=`, și `in` folosesc `__eq__`, gratis

---

`__lt__(self, other)` înseamnă „mai mic decât”, semnul `<`. Odată ce o clasă îl are, `sorted()`, `min()` și `max()` merg pe obiectele ei, pentru că ele compară cu `<`

```py
class Nava:
    def __init__(self, nume, viteza):
        self.nume = nume
        self.viteza = viteza

    def __lt__(self, other):
        return self.viteza < other.viteza

flota = [Nava("Speranta", 12), Nava("Fulger", 30), Nava("Bob", 5)]
print([n.nume for n in sorted(flota)])
print(max(flota).nume)
print(Nava("A", 1) < Nava("B", 2))
```

Rezultat

```text
['Bob', 'Speranta', 'Fulger']
Fulger
True
```

---

Un truc util în aceste metode: compară tuple-uri. Tuple-urile își compară primele valori și, doar la egalitate, pe a doua și tot așa

```py
print((2, 5) < (2, 9))
print((3, 0) < (2, 9))
```

Rezultat

```text
True
False
```

Așa că `return (self.viteza, self.nume) < (other.viteza, other.nume)` sortează după viteză și după nume când vitezele sunt egale

---

## Misiune: Numerele versiunilor

Calculatorul stației primește actualizări cu numere de versiune ca `1.10.2`. Ca text, `"1.10.2"` vine înaintea lui `"1.9.0"`, ceea ce e greșit: 10 e mai mare decât 9. Stația are nevoie de versiuni care se compară ca numere

1. Scrie o clasă **Versiune** cu un `__init__` care primește un `text` ca `"1.10.2"` și îl păstrează, împreună cu părțile lui ca numere întregi, un `__str__` care returnează textul, un `__eq__` care spune că două versiuni sunt egale când numerele lor sunt egale și un `__lt__` care compară primele numere, apoi pe al doilea la egalitate, apoi pe al treilea
2. Începe programul cu două variabile: **versiuni**, o listă de string-uri, și **curenta**, un string. De exemplu `versiuni = ["1.10.2", "1.9.0", "2.0.0", "1.9.0"]` și `curenta = "1.10.2"`
3. Afișează versiunile de la cea mai veche la cea mai nouă, folosind `sorted()` pe obiecte `Versiune`, unite cu `<` cu câte un spațiu de fiecare parte
4. Afișează `Cea mai noua: ` și cea mai nouă versiune
5. Afișează `La zi: ` și `da` dacă versiunea curentă e egală cu cea mai nouă, sau `nu`

Fiecare versiune are trei numere de la 0 la 99, unite cu puncte. **versiuni** are între 1 și 10 versiuni

**Exemplu** pentru valorile de mai sus

```text
1.9.0 < 1.9.0 < 1.10.2 < 2.0.0
Cea mai noua: 2.0.0
La zi: nu
```
