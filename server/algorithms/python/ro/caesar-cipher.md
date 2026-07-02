# Cifrul lui Caesar

Criptează un șir folosind **cifrul Caesar**: deplasează fiecare literă înainte cu un număr dat de poziții în alfabet. Caracterele care nu sunt litere rămân neschimbate.

### Date de intrare

- Linia 1: un șir `s` (poate conține litere mari, litere mici, spații și semne de punctuație).
- Linia 2: un număr întreg `shift` (1-25).

### Rezultat

Șirul criptat, păstrând litera mare/mică originală a fiecărei litere.

### Exemple

```
Intrare:
abc
3

Ieșire:
def
```

```
Intrare:
Hello, World!
5

Ieșire:
Mjqqt, Btwqi!
```

```
Intrare:
az
1

Ieșire:
ba
```

Alfabetul se reia de la capăt: deplasând `z` cu 1 ajungi înapoi la `a`.

```
Intrare:
Zebra
1

Ieșire:
Afcsb
```

Literele mari se reiau la fel, rămânând mari: `Z` devine `A`.
