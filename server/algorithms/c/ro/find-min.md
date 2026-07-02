# Ușor · Găsește minimul

Citește un întreg **N**, apoi citește **N** numere întregi. Afișează cea mai **mică** valoare.

Acest exercițiu antrenează urmărirea unui minim curent în timp ce se citesc datele de intrare.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 100)
- A doua linie: `N` numere întregi separate prin spații

### Rezultat

Un singur întreg: valoarea minimă dintre cele `N` numere.

### Exemple

```
Intrare:
5
3 1 4 1 5
Ieșire: 1
```

```
Intrare:
3
10 20 30
Ieșire: 10
```

```
Intrare:
1
7
Ieșire: 7
```

```
Intrare:
4
-5 -1 -10 -3
Ieșire: -10
```

### Indicii

- Citește primul număr și setează-l ca `min` inițial.
- Parcurge numerele rămase; dacă un număr este mai mic decât `min`, actualizează `min`.
- Poți de asemenea să stochezi totul mai întâi într-un tablou și apoi să-l parcurgi — ambele abordări funcționează.
