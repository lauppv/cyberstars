# Verificare palindrom

Având un șir, verifică dacă este un **palindrom** (se citește la fel de la stânga la dreapta și invers).

### Date de intrare

O singură linie care conține un șir `s` (doar litere mici, fără spații).

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

Palindroamele pot avea și un număr par de caractere — nu există un caracter
din mijloc de ignorat, cele două jumătăți trebuie doar să se oglindească.

```
Intrare:  ab
Ieșire: False
```

### Indicii

- Un șir este palindrom dacă `s == s[::-1]`.
- Poți de asemenea să compari caracterele de la ambele capete folosind o buclă.
- Caracterele singulare și șirurile goale sunt palindromuri.
