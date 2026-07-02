# Ușor · Numără numerele pare

Citește un întreg **N**, apoi citește **N** numere întregi. Afișează câte dintre ele sunt **pare**.

Acest exercițiu antrenează folosirea operatorului modulo (`%`) pentru a verifica divizibilitatea.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 100)
- A doua linie: `N` numere întregi separate prin spații

### Rezultat

Un singur întreg: numărul de numere pare.

### Exemple

```
Intrare:
5
1 2 3 4 5
Ieșire: 2
```

```
Intrare:
4
2 4 6 8
Ieșire: 4
```

```
Intrare:
3
1 3 5
Ieșire: 0
```

Când niciunul dintre numere nu e par, numărătoarea rămâne la 0 — se afișează totuși.

### Indicii

- Un număr este par dacă `x % 2 == 0`.
- Păstrează o variabilă contor, pornind de la `0`. Incrementeaz-o de fiecare dată când citești un număr par.
- Poți verifica fiecare număr pe măsură ce îl citești cu `scanf` — nu este nevoie de un tablou.
