# Suma a două numere

Având o listă de numere întregi și o valoare țintă, găsește **cei doi indici** ale căror valori însumate dau ținta.

Poți presupune că există **exact o singură** pereche validă, și nu poți folosi același element de două ori. Afișează indicii în ordine crescătoare.

### Date de intrare

- Linia 1: `n` numere întregi separate prin spații (lista).
- Linia 2: un singur număr întreg `tinta`.

### Rezultat

Doi indici `i j` indexați de la 0 (cu `i < j`) astfel încât `numere[i] + numere[j] == tinta`.

### Exemple

```
Intrare:
2 7 11 15
9

Ieșire:
0 1
```

```
Intrare:
3 2 4
6

Ieșire:
1 2
```

```
Intrare:
3 3
6

Ieșire:
0 1
```

Aceeași valoare poate apărea de două ori — atât timp cât se află la indici
diferiți, tot contează ca două numere separate.

```
Intrare:
-3 4 3 90
0

Ieșire:
0 2
```

Numerele negative funcționează la fel: `-3 + 3 == 0`.
