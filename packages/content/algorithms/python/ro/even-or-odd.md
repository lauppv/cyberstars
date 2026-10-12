Având un număr întreg, determină dacă este **par** sau **impar**.

### Date de intrare

O singură linie care conține un număr întreg `n` (poate fi negativ) cu cel mult 19 cifre, fără a număra semnul minus.

### Rezultat

Afișează `Par` dacă numărul este par, sau `Impar` dacă numărul este impar.

### Exemple

```
Intrare:  4
Ieșire: Par
```

```
Intrare:  7
Ieșire: Impar
```

```
Intrare:  0
Ieșire: Par
```

```
Intrare:  -3
Ieșire: Impar
```

Numerele negative funcționează la fel: `-3 % 2` este `1` în Python. Nu este
`0`, deci `-3` este impar.
