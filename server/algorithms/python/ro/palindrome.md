Având un șir, verifică dacă este un **palindrom** (se citește la fel de la stânga la dreapta și invers).

### Date de intrare

O singură linie care conține un șir `s` de 1 până la 10^5 caractere (doar litere mici `a`-`z`, fără spații).

### Rezultat

Afișează `True` dacă `s` este palindrom, `False` altfel.

### Exemple

```
Intrare:  racecar
Ieșire: True
```

```
Intrare:  hello
Ieșire: False
```

```
Intrare:  a
Ieșire: True
```

```
Intrare:  abba
Ieșire: True
```

Palindroamele pot avea și un număr par de caractere. Nu există un caracter
din mijloc de ignorat, cele două jumătăți trebuie doar să se oglindească.

```
Intrare:  ab
Ieșire: False
```
