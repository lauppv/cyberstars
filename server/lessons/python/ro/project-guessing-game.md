E timpul pentru un mini-proiect! O să construim un **joc de ghicit numere**. Calculatorul alege un număr aleatoriu și jucătorul trebuie să-l ghicească. După fiecare ghicire, programul spune **prea mare**, **prea mic**, sau **corect!**

Asta combină tot ce am învățat: **variabile**, **bucle**, **if/else**, **input**, **funcții**, și chiar un pic de **try/except**

---

Mai întâi, cum obținem un număr aleatoriu? Python are un modul încorporat pentru asta

```py
import random

numar_secret = random.randint(1, 100)
print(numar_secret)
```

**import random** aduce modulul random. **random.randint(1, 100)** ne dă un întreg aleatoriu între 1 și 100 (inclusiv). De fiecare dată când îl rulăm, obținem un alt număr

---

Hai să construim jocul pas cu pas

**Pasul 1**: generează un număr secret

```py
import random
numar_secret = random.randint(1, 100)
```

**Pasul 2**: cere-i jucătorului o ghicire, și spune-i dacă e prea mare sau prea mică

```py
ghicire = int(input("Ghicește un număr (1-100): "))
if ghicire < numar_secret:
    print("Prea mic!")
elif ghicire > numar_secret:
    print("Prea mare!")
else:
    print("Corect!")
```

**Pasul 3**: pune-l într-o buclă ca să poată ghici în continuare

```py
import random

numar_secret = random.randint(1, 100)
incercari = 0

while True:
    ghicire = int(input("Ghicește un număr (1-100): "))
    incercari += 1

    if ghicire < numar_secret:
        print("Prea mic!")
    elif ghicire > numar_secret:
        print("Prea mare!")
    else:
        print(f"Corect! L-ai ghicit în {incercari} încercări!")
        break
```

Ăsta e un joc complet! Dar îl putem face mai bun limitând numărul de încercări și tratând inputul invalid

---

Versiunea completă

```py
import random

def joaca_joc():
    numar_secret = random.randint(1, 100)
    maxim_incercari = 7

    print("Mă gândesc la un număr între 1 și 100")
    print(f"Ai {maxim_incercari} încercări. Mult noroc!")

    for incercare in range(1, maxim_incercari + 1):
        try:
            ghicire = int(input(f"Încercarea {incercare}/{maxim_incercari}: "))
        except ValueError:
            print("Ăsta nu e un număr!")
            continue

        if ghicire < numar_secret:
            print("Prea mic!")
        elif ghicire > numar_secret:
            print("Prea mare!")
        else:
            print(f"Corect! L-ai ghicit în {incercare} încercări!")
            return

    print(f"Joc terminat! Numărul a fost {numar_secret}")

joaca_joc()
```

Observă cum am folosit **tot**: import, funcție, buclă for, try/except, if/elif/else, f-string-uri, return (ca să ieșim devreme când ghicesc corect)

---

## Misiune: Spărgătorul de Cod al Reactorului

Reactorul este blocat în spatele unui cod numeric secret. Un instrument de diagnosticare a înregistrat deja o secvență de ghiciri (deja în dreapta) — redă-le și raportează cum a decurs spargerea. Nu există nimic aleatoriu aici, așa că rezultatul este același la fiecare rulare.

1. Scrie o funcție **verifica_ghicirea(numar_secret, ghicire)** care returnează `"prea mic"` dacă ghicirea e mai mică decât secretul, `"prea mare"` dacă e mai mare, și `"corect"` dacă se potrivesc.
2. Parcurge ghicirile, numărând încercările. Pentru fiecare ghicire, afișează ghicirea, apoi `: `, apoi rezultatul.
3. **Oprește-te** imediat ce o ghicire e corectă, apoi afișează `Spart în N încercări!` (cu numărul real de încercări).

**Ieșire**

```text
50: prea mare
30: prea mic
40: prea mic
45: prea mare
42: corect
Spart în 5 încercări!
```
