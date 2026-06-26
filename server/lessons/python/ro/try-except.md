Uneori lucrurile merg prost. Utilizatorul tastează un cuvânt când noi așteptăm un număr. Încercăm să accesăm un index dintr-o listă care nu există. Împărțim la zero. Aceste lucruri se numesc **erori** sau **excepții** și **prăbușesc** programul

```py
numar = int("abc")
```

**Rulează**-l. **ValueError**. Python nu poate converti "abc" într-un număr

```py
nume = ["Tommy", "Lance"]
print(nume[10])
```

**Rulează**-l. **IndexError**. Nu există niciun element la poziția 10

```py
print(10 / 0)
```

**Rulează**-l. **ZeroDivisionError**. Matematica zice nu

---

Până acum, când apărea o eroare, programul se prăbușea și gata. Dar într-un program real, nu vrem o prăbușire. Vrem să **gestionăm** eroarea elegant și să mergem mai departe

Aici intervin **try** și **except**

```py
try:
    numar = int("abc")
    print(numar)
except:
    print("Acela nu e un numar valid")
```

Rezultat **Acela nu e un număr valid**

Cum funcționează: Python **încearcă** (try) să ruleze codul din blocul **try**. Dacă totul merge bine, continuă normal. Dacă apare o eroare, în loc să se prăbușească, Python sare la blocul **except** și rulează acel cod în schimb

```py
try:
    varsta = int(input("Varsta ta: "))
    print(f"La anul vei avea {varsta + 1}")
except:
    print("Te rog introdu un numar, nu text!")
```

Dacă utilizatorul tastează **18**, totul funcționează. Dacă tastează **hello**, primim un mesaj prietenos în loc de o prăbușire

---

Putem fi **specifici** în privința erorii pe care vrem să o prindem

```py
try:
    numar = int(input("Introdu un numar: "))
    rezultat = 100 / numar
    print(rezultat)
except ValueError:
    print("Acela nu e un numar!")
except ZeroDivisionError:
    print("Nu poti imparti la zero!")
```

Dacă utilizatorul tastează text → este prinsă o **ValueError**. Dacă tastează **0** → este prinsă o **ZeroDivisionError**. Fiecare eroare primește propriul mesaj. Asta e mai bine decât un **except** generic, pentru că știm exact ce a mers prost

---

Un tipar comun: continuă să întrebi până când utilizatorul oferă o intrare validă

```py
while True:
    try:
        varsta = int(input("Varsta ta: "))
        break
    except ValueError:
        print("Acela nu e un numar, mai incearca")

print(f"Varsta ta este {varsta}")
```

Bucla **while True** continuă să ruleze. Dacă **int()** reușește, **ieșim** (break) din buclă. Dacă eșuează, afișăm un mesaj și bucla continuă. Este un tipar pe care îl vei folosi mult

---

Putem folosi și **else** (rulează doar dacă nu a apărut nicio eroare) și **finally** (rulează indiferent de situație)

```py
try:
    numar = int("42")
except ValueError:
    print("Eroare!")
else:
    print("Nicio eroare, super!")
finally:
    print("Asta ruleaza mereu")
```

Ieșire

```text
Nicio eroare, super!
Asta ruleaza mereu
```

**else** și **finally** sunt opționale. Deocamdată, **try** și **except** sunt cele importante

---

## Misiune: Curățarea Senzorilor

Stația primește o listă de citiri de senzori sub formă de **string-uri**, dar unele sunt corupte — nu sunt deloc numere. Parcurge lista și, folosind **try/except**, transformă fiecare element într-un întreg:

- dacă se convertește, adaugă-l la un **total** curent
- dacă `int()` aruncă o `ValueError`, numără-l drept **corupt** și mergi mai departe (fără prăbușire)

La final, afișează:

- `Total: ` apoi suma citirilor valide
- `Corupte: ` apoi câte citiri au eșuat

**Ieșire**

```text
Total: 162
Corupte: 2
```

Citirile valide sunt `42`, `100`, `7` și `13` (suma `162`); `x9` și `bad` sunt cele două corupte.
