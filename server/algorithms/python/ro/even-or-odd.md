# Par sau impar

Având un număr întreg, determină dacă este **par** sau **impar**.

### Date de intrare

O singură linie care conține un număr întreg `n`.

### Rezultat

Afișează `Even` dacă numărul este par, sau `Odd` dacă numărul este impar.

### Exemple

```
Intrare:  4
Ieșire: Even
```

```
Intrare:  7
Ieșire: Odd
```

```
Intrare:  0
Ieșire: Even
```

```
Intrare:  -3
Ieșire: Odd
```

Numerele negative funcționează la fel: `-3 % 2` este `1` în Python — nu este
`0`, deci `-3` este impar.

### Indicii

- Operatorul modulo `%` îți dă restul unei împărțiri.
- Un număr este par când `n % 2 == 0`.
- Nu uita să convertești intrarea într-un număr întreg cu `int()`.
