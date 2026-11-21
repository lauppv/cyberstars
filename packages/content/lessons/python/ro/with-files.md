E ușor să uităm `.close()`, iar dacă programul se oprește cu o eroare înainte de el, fișierul nu mai e închis niciodată. Blocul `with` închide fișierul pentru noi, mereu. Așa deschid programatorii Python fișierele

---

`with`, apoi `open(...)`, `as` și un nume pentru fișier. În bloc folosim fișierul. Când blocul se termină, Python îl închide

```py
with open("echipaj.txt", "w") as f:
    f.write("Ada\n")
    f.write("Alan\n")

with open("echipaj.txt") as f:
    print(f.read())
```

Rezultat

```text
Ada
Alan

```

Niciun `.close()` nicăieri. Fișierul e închis imediat ce liniile din bloc s-au terminat

---

Fișierul e închis chiar și când ceva din bloc merge prost. Aici o eroare oprește blocul la jumătate, dar ce s-a scris înainte e salvat

```py
try:
    with open("echipaj.txt", "w") as f:
        f.write("Ada\n")
        f.write(42)
except TypeError:
    print("nu am putut scrie un numar")

with open("echipaj.txt") as f:
    print(repr(f.read()))
```

Rezultat

```text
nu am putut scrie un numar
'Ada\n'
```

`f.write(42)` dă eroare, pentru că `.write()` primește doar string-uri. Python a închis totuși fișierul la ieșire, așa că `Ada` a fost salvat

---

Un singur `with` poate deschide două fișiere, cu o virgulă între ele. E util când citim un fișier și scriem altul în același timp

```py
with open("numere.txt", "w") as f:
    f.write("4\n9\n16\n")

with open("numere.txt") as sursa, open("radacini.txt", "w") as tinta:
    for linie in sursa.read().splitlines():
        tinta.write(f"{int(linie) ** 0.5}\n")

with open("radacini.txt") as f:
    print(f.read())
```

Rezultat

```text
2.0
3.0
4.0

```

---

Numele fișierului din `with` merge doar cât fișierul e deschis. După bloc, scrierea în el dă eroare, pentru că fișierul e închis

```py
with open("echipaj.txt", "w") as f:
    f.write("Ada\n")

try:
    f.write("Alan\n")
except ValueError:
    print("fisierul e inchis")
```

Rezultat

```text
fisierul e inchis
```

De acum încolo, deschide fișierele cu `with`

---

## Misiune: Alertele radio

Toate mesajele radio ajung într-un fișier. Echipajul vrea un al doilea fișier doar cu mesajele care pomenesc un anumit cuvânt

1. Începe programul cu două variabile: **mesaje**, o listă de string-uri, și **cuvant**, un string. De exemplu `mesaje = ["doc liber", "foc in laborator", "usa laboratorului deschisa"]` și `cuvant = "laborator"`
2. Cu un bloc `with`, scrie mesajele în `radio.txt`, câte unul pe linie
3. Cu un singur bloc `with` care deschide amândouă fișierele, citește `radio.txt` și scrie în `alerte.txt` doar mesajele care conțin cuvântul, câte unul pe linie, în aceeași ordine
4. Cu un bloc `with`, citește `alerte.txt` și afișează fiecare linie, numerotată de la 1, ca `1. foc in laborator`. Apoi afișează `Alerte: ` și câte au fost

Folosește `with` pentru fiecare fișier și niciun `.close()`. **mesaje** are între 1 și 15 mesaje, toate cu litere mici, iar **cuvant** are tot litere mici

**Exemplu** pentru valorile de mai sus

```text
1. foc in laborator
2. usa laboratorului deschisa
Alerte: 2
```
