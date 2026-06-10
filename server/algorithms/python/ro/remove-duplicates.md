# Elimină duplicatele

Având o listă de numere, afișează-le **fără duplicate**, păstrând ordinea originală.

### Date de intrare

- Linia 1: un număr întreg `n` — câte numere sunt.
- Linia 2: `n` numere întregi separate prin spații.

### Rezultat

Numerele cu duplicatele eliminate, separate prin spații, în ordinea în care au apărut prima dată.

### Exemple

```
Intrare:
7
3 1 4 1 5 9 3

Ieșire:
3 1 4 5 9
```

```
Intrare:
5
1 1 1 1 1

Ieșire:
1
```

### Indicii

- Folosește un `set` pentru a urmări ce numere ai văzut deja.
- Parcurge lista — dacă un număr nu este în set, adaugă-l la rezultat și la set.
- Set-urile au căutare O(1), deci verificarea `if x in seen` este rapidă.
- Unește lista de rezultate cu `" ".join(...)` pentru a o afișa frumos.
