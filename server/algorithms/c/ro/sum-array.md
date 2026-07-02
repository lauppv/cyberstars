# Ușor · Suma unui tablou

Citește un întreg **N**, apoi citește **N** numere întregi. Afișează **suma** lor.

Acest exercițiu antrenează citirea valorilor cu `scanf` într-o buclă și acumularea unui total.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 100)
- A doua linie: `N` numere întregi separate prin spații

### Rezultat

Un singur întreg: suma tuturor celor `N` numere.

### Exemple

```
Intrare:
5
1 2 3 4 5
Ieșire: 15
```

```
Intrare:
3
10 -3 7
Ieșire: 14
```

```
Intrare:
1
7
Ieșire: 7
```

```
Intrare:
3
-1 -2 -3
Ieșire: -6
```

### Indicii

- Inițializează o variabilă `sum` cu `0` înainte de buclă.
- Folosește `scanf("%d", &x)` în interiorul unei bucle `for` pentru a citi fiecare număr.
- Adaugă fiecare număr la `sum` pe măsură ce îl citești — nici măcar nu ai nevoie de un tablou!
