Uneori nu trebuie să numărăm lucruri sau să acumulăm un rezultat. Trebuie doar să știm: **s-a întâmplat ceva sau nu?** Da sau nu. Acesta este **tiparul steag (flag)**

Un **steag** este o variabilă booleană care pornește ca **True** sau **False** și se schimbă când o anumită condiție este îndeplinită

```py
numere = [2, 4, 6, 8, 10]
allEven = True

for n in numere:
    if n % 2 != 0:
        allEven = False

if allEven:
    print("Toate numerele sunt pare")
else:
    print("Nu toate numerele sunt pare")
```

Rezultat **Toate numerele sunt pare**

Am pornit de la presupunerea **allEven = True** (optimist, credem că sunt toate pare). Dacă găsim măcar un număr care **nu** este par, setăm steagul la **False**. La final, verificăm steagul

```py
numere = [2, 4, 7, 8, 10]
allEven = True

for n in numere:
    if n % 2 != 0:
        allEven = False

if allEven:
    print("Toate numerele sunt pare")
else:
    print("Nu toate numerele sunt pare")
```

Rezultat **Nu toate numerele sunt pare** (din cauza lui 7)

---

Și varianta opusă funcționează: pornim cu **False** și trecem la **True**

```py
nume = ["Tommy", "Lance", "Cortez", "Phil"]
tinta = "Cortez"
gasit = False

for n in nume:
    if n == tinta:
        gasit = True

if gasit:
    print(f"{tinta} este în listă!")
else:
    print(f"{tinta} nu este în listă")
```

Rezultat **Cortez este în listă!**

Pornim pesimist (**gasit = False**) și trecem la **True** doar dacă chiar găsim ținta

---

Putem combina steagul cu **break** pentru eficiență. Odată ce am găsit ce ne trebuie, de ce să continuăm căutarea?

```py
nume = ["Tommy", "Lance", "Cortez", "Phil"]
tinta = "Lance"
gasit = False

for n in nume:
    if n == tinta:
        gasit = True
        break

if gasit:
    print(f"Găsit {tinta}!")
else:
    print(f"{tinta} negăsit")
```

---

Un exemplu practic: verificarea dacă o parolă este **puternică** (are cel puțin o literă majusculă, o literă minusculă și o cifră)

```py
parola = "Tommy123"
hasUpper = False
hasLower = False
hasDigit = False

for char in parola:
    if char.isupper():
        hasUpper = True
    elif char.islower():
        hasLower = True
    elif char.isdigit():
        hasDigit = True

if hasUpper and hasLower and hasDigit:
    print("Parolă puternică")
else:
    print("Parolă slabă")
```

Rezultat **Parolă puternică**. Trei steaguri, câte unul pentru fiecare cerință

---

## Misiune: Verificarea Codului de Acces

Un cod de acces al stației este **valid** doar dacă îndeplinește **toate cele trei** reguli: are cel puțin o literă **majusculă**, cel puțin o **cifră** și are cel puțin **6 caractere** lungime.

**Citește** un cod, apoi folosește **steaguri** (`has_upper` și `has_digit`, fiecare pornind de la `False` și schimbat la `True` când găsești unul) plus o verificare a lungimii. Afișează fiecare rezultat, apoi verdictul:

**Input** (tastat de utilizator când rulează programul):

- codul de acces

**Rezultat** — patru linii: cele trei verificări, apoi `Cod de acces valid` sau `Cod de acces invalid`.

**Exemplu**

Dacă utilizatorul tastează

```text
Orbit42
```

programul ar trebui să afișeze

```text
Are majusculă: True
Are cifră: True
Suficient de lung: True
Cod de acces valid
```

Dacă utilizatorul tastează

```text
orbit
```

programul ar trebui să afișeze

```text
Are majusculă: False
Are cifră: False
Suficient de lung: False
Cod de acces invalid
```
