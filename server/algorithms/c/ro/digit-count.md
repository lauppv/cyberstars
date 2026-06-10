# Easy · Count Digits

Citește un singur număr întreg și afișează câte **cifre** are.

Acest exercițiu antrenează folosirea unei bucle `while` și a împărțirii întregi.

### Date de intrare

- Un singur întreg `N` (0 ≤ N ≤ 1 000 000 000)

### Rezultat

Un singur întreg: numărul de cifre din `N`.

### Exemple

```
Intrare:
12345
Ieșire: 5
```

```
Intrare:
0
Ieșire: 1
```

### Indicii

- Caz special: dacă numărul este `0`, răspunsul este `1`.
- Altfel, continuă să împarți la `10` într-o buclă și numără de câte ori poți face acest lucru înainte ca numărul să devină `0`.
- Folosește `n = n / 10` (sau `n /= 10`) pentru a elimina ultima cifră la fiecare iterație.
