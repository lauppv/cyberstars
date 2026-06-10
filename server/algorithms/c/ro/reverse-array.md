# Easy · Reverse an Array

Citește un întreg **N**, apoi citește **N** numere întregi. Afișează-le în ordine **inversă**, separate prin spații.

Acest exercițiu antrenează citirea într-un tablou C și parcurgerea în sens invers.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 100)
- A doua linie: `N` numere întregi separate prin spații

### Rezultat

Cele `N` numere întregi în ordine inversă, separate prin spații, pe o singură linie.

### Exemple

```
Intrare:
5
1 2 3 4 5
Ieșire: 5 4 3 2 1
```

```
Intrare:
3
10 20 30
Ieșire: 30 20 10
```

### Indicii

- Declară un tablou de dimensiune 100 (sau folosește `N` cu un VLA).
- Folosește `scanf` într-o buclă pentru a citi valorile.
- Parcurge de la `N-1` până la `0` pentru a afișa în sens invers.
