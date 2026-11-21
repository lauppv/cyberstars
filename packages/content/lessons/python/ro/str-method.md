Dacă afișăm unul dintre obiectele noastre, vedem ceva ca `<__main__.Planeta object at 0x7f3a...>`: clasa lui și locul din memorie unde stă. Nu prea util. O metodă numită `__str__` îi spune lui Python cum să arate obiectul ca text

---

`__str__` primește doar `self` și returnează un string. `print()` o apelează singur

```py
class Planeta:
    def __init__(self, nume, luni):
        self.nume = nume
        self.luni = luni

    def __str__(self):
        return f"{self.nume} cu {self.luni} luni"

marte = Planeta("Marte", 2)
print(marte)
```

Rezultat

```text
Marte cu 2 luni
```

Nu apelăm noi `marte.__str__()`. O face Python oricând obiectul trebuie să devină text

---

Și `str()`, și f-string-urile folosesc `__str__`, așa că obiectul intră direct în orice text

```py
class Planeta:
    def __init__(self, nume, luni):
        self.nume = nume
        self.luni = luni

    def __str__(self):
        return f"{self.nume} cu {self.luni} luni"

pamant = Planeta("Pamant", 1)
text = str(pamant)
print(text.upper())
print(f"Acasa: {pamant}")
```

Rezultat

```text
PAMANT CU 1 LUNI
Acasa: Pamant cu 1 luni
```

---

`__str__` își poate alege cuvintele, ca orice metodă. Aici o planetă fără luni spune asta

```py
class Planeta:
    def __init__(self, nume, luni):
        self.nume = nume
        self.luni = luni

    def __str__(self):
        if self.luni == 0:
            return f"{self.nume}, fara luni"
        return f"{self.nume}, luni: {self.luni}"

for planeta in [Planeta("Venus", 0), Planeta("Marte", 2)]:
    print(planeta)
```

Rezultat

```text
Venus, fara luni
Marte, luni: 2
```

---

O listă de obiecte se afișează cu altă metodă, `__repr__`, gândită pentru programatori. Fără ea, o listă afișată arată din nou adresele din memorie. Calea ușoară e să afișăm elementele unul câte unul sau să le unim textele

```py
class Planeta:
    def __init__(self, nume):
        self.nume = nume

    def __str__(self):
        return self.nume

planete = [Planeta("Venus"), Planeta("Marte")]
print(" | ".join(str(p) for p in planete))
```

Rezultat

```text
Venus | Marte
```

---

## Misiune: Fișele planetelor

Școala stației arată o fișă pentru fiecare planetă. Fiecare fișă e o linie de text, făcută chiar de obiectul planetei

1. Scrie o clasă **Planeta** cu un `__init__` care primește un `nume`, un număr de `luni` și `inele` (True sau False), și un `__str__` care returnează `nume, luni: N`, cu `, inele` adăugat la final când planeta are inele. O planetă cu 0 luni spune `nume, fara luni` în loc de `luni: 0`
2. Începe programul cu trei variabile: **nume**, **luni** și **inele**, trei liste în aceeași ordine. De exemplu `nume = ["Saturn", "Marte", "Venus"]`, `luni = [146, 2, 0]` și `inele = [True, False, False]`
3. Fă câte o `Planeta` pentru fiecare și afișează-le pe fiecare cu `print()`, dându-i chiar obiectul
4. Afișează `Cu inele: ` și fișele planetelor cu inele unite cu `/` cu câte un spațiu de fiecare parte, sau `niciuna`

Listele au între 1 și 10 planete, cu 0 până la 200 de luni fiecare

**Exemplu** pentru valorile de mai sus

```text
Saturn, luni: 146, inele
Marte, luni: 2
Venus, fara luni
Cu inele: Saturn, luni: 146, inele
```
