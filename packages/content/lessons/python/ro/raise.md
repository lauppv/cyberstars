În lecția Try / Except am prins erorile pe care le aruncă Python, ca un ValueError de la `int("abc")`. Și codul nostru poate arunca erori, cu `raise`. O funcție aruncă una când primește ceva cu care nu poate lucra, în loc să meargă mai departe și să dea un răspuns greșit

---

`raise`, apoi o eroare cu un mesaj. Programul se oprește chiar acolo, ca la orice eroare, dacă nu o prinde cineva

```py
def seteaza_viteza(viteza):
    if viteza < 0:
        raise ValueError("viteza nu poate fi negativa")
    print("viteza setata la", viteza)

seteaza_viteza(12)
seteaza_viteza(-5)
print("linia asta nu ruleaza niciodata")
```

Rulează-l: primul apel merge, al doilea oprește programul cu `ValueError: viteza nu poate fi negativa`, mesajul nostru

---

Codul care apelează funcția decide ce face cu eroarea. O prinde cu `try` și `except`, ca pe erorile lui Python. `as e` ne dă eroarea, iar `str(e)` mesajul ei

```py
def seteaza_viteza(viteza):
    if viteza < 0:
        raise ValueError("viteza nu poate fi negativa")
    return viteza

for valoare in [12, -5, 30]:
    try:
        print("setata", seteaza_viteza(valoare))
    except ValueError as e:
        print("refuzata:", e)
```

Rezultat

```text
setata 12
refuzata: viteza nu poate fi negativa
setata 30
```

Funcția spune doar ce e greșit. Nu afișează și nu decide ce se întâmplă mai departe: asta e treaba celui care o apelează

---

Alege eroarea potrivită. `ValueError` e pentru o valoare de felul bun, dar greșită, ca o viteză negativă. `TypeError` e pentru o valoare de alt fel, ca un cuvânt acolo unde trebuie un număr

```py
def seteaza_viteza(viteza):
    if not isinstance(viteza, int):
        raise TypeError("viteza trebuie sa fie un numar intreg")
    if viteza < 0:
        raise ValueError("viteza nu poate fi negativa")
    return viteza

try:
    seteaza_viteza("repede")
except TypeError as e:
    print(e)
```

Rezultat

```text
viteza trebuie sa fie un numar intreg
```

---

Într-un bloc `except`, un `raise` singur aruncă din nou aceeași eroare. E pentru când vrem să notăm ceva, dar să lăsăm eroarea să meargă mai departe

```py
try:
    try:
        int("abc")
    except ValueError:
        print("am notat numarul gresit")
        raise
except ValueError as e:
    print("afara:", e)
```

Rezultat

```text
am notat numarul gresit
afara: invalid literal for int() with base 10: 'abc'
```

---

## Misiune: Codurile ușilor

Membrii echipajului își aleg un cod pentru ușa cabinei. Calculatorul refuză un cod prea ușor de ghicit și spune de ce

1. Scrie o funcție **verifica_cod(cod)** care aruncă un `ValueError` când codul e prost, cu unul dintre aceste mesaje, verificate în ordinea asta: `prea scurt` când are mai puțin de 4 caractere, `doar cifre` când are altceva decât cifre, `toate la fel` când toate cifrele sunt la fel, `in sir` când cifrele cresc cu câte unu, ca `1234`. Când codul e bun, îl returnează
2. Începe programul cu o variabilă **coduri**, o listă de string-uri. De exemplu `coduri = ["12", "4a21", "7777", "3456", "9071"]`
3. Pentru fiecare cod, apelează `verifica_cod()` și afișează codul, `: ` și `ok`, sau mesajul erorii când aruncă una

Fiecare cod are între 0 și 8 caractere

**Exemplu** pentru codurile de mai sus

```text
12: prea scurt
4a21: doar cifre
7777: toate la fel
3456: in sir
9071: ok
```
