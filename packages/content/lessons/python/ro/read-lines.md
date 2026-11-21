`.read()` încarcă tot fișierul deodată. E în regulă pentru fișiere mici, dar un jurnal poate avea milioane de linii. Un fișier deschis pentru citire poate fi folosit direct într-o buclă `for`, care ni-l dă câte o linie

---

La fiecare pas al buclei, `linie` are următoarea linie din fișier, cu `\n` la final. `.strip()` îl scoate

```py
with open("echipaj.txt", "w") as f:
    f.write("Ada\nAlan\nGrace\n")

with open("echipaj.txt") as f:
    for linie in f:
        print(f"[{linie.strip()}]")
```

Rezultat

```text
[Ada]
[Alan]
[Grace]
```

Fără `.strip()`, `print()` și-ar adăuga linia nouă după cea din fișier și am avea o linie goală între nume

---

Python ține în memorie doar o linie odată, așa că merge pentru un fișier de orice mărime. Și tot ce știm despre bucle merge și aici: `enumerate()` ca să numărăm liniile, `continue` ca să sărim peste unele, `break` ca să ne oprim mai devreme

```py
with open("echipaj.txt", "w") as f:
    f.write("# lista echipajului\nAda\n\nAlan\n")

with open("echipaj.txt") as f:
    for numar, linie in enumerate(f, start=1):
        linie = linie.strip()
        if linie == "" or linie.startswith("#"):
            continue
        print(numar, linie)
```

Rezultat

```text
2 Ada
4 Alan
```

Fișierele adevărate au des linii goale și comentarii. Dacă sărim peste ele de la început, restul buclei rămâne simplu

---

`.readlines()` dă toate liniile ca listă, fiecare cu `\n` al ei. E util când avem nevoie de linii de mai multe ori sau trebuie să știm întâi câte sunt

```py
with open("echipaj.txt", "w") as f:
    f.write("Ada\nAlan\nGrace\n")

with open("echipaj.txt") as f:
    linii = f.readlines()
print(linii)
print(linii[-1].strip())
```

Rezultat

```text
['Ada\n', 'Alan\n', 'Grace\n']
Grace
```

---

O linie are des mai multe valori. Taie-o cu `.split()`, apoi transformă bucățile în numere unde e nevoie

```py
with open("puncte.txt", "w") as f:
    f.write("Ada 12\nAlan 7\n")

total = 0
with open("puncte.txt") as f:
    for linie in f:
        nume, puncte = linie.split()
        total += int(puncte)
print(total)
```

Rezultat

```text
19
```

---

## Misiune: Jurnalul temperaturii

Un senzor scrie temperatura într-un fișier în fiecare oră. Fișierul are și notițe care încep cu `#` și câteva linii goale. Inginerii vor un rezumat al citirilor adevărate

1. Începe programul cu o variabilă **linii**, o listă de string-uri: liniile jurnalului. O citire e o oră și un număr întreg, ca `"08:00 21"`. De exemplu `linii = ["# dimineata", "08:00 21", "", "09:00 25", "10:00 19"]`
2. Scrie liniile în `temperaturi.txt`, câte una pe linie
3. Citește `temperaturi.txt` linie cu linie, cu o buclă `for` peste fișier. Sari peste liniile goale și peste notițe
4. Afișează `Citiri: ` și câte citiri sunt, apoi `Minima: `, `Maxima: ` și `Media: ` și temperatura cea mai mică, cea mai mare și media. Media are o zecimală. Dacă nu e nicio citire, afișează doar `Citiri: 0`

**linii** are între 1 și 24 de linii. Temperaturile sunt de la -40 la 50

**Exemplu** pentru liniile de mai sus

```text
Citiri: 3
Minima: 19
Maxima: 25
Media: 21.7
```
