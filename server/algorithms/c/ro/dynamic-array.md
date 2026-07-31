Citește un întreg **N**, apoi citește **N** numere întregi. Stochează-le într-un tablou **alocat dinamic** (folosind `malloc`). Afișează **suma** și **media** (cu 2 zecimale) numerelor. Nu uita să eliberezi memoria cu `free`.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 1000)
- Următoarele `N` linii: câte un număr întreg

### Rezultat

Două linii:

- Prima linie: suma (întreg)
- A doua linie: media (număr în virgulă mobilă, 2 zecimale)

### Exemple

```
Intrare:
4
10
20
30
40
Ieșire:
100
25.00
```

```
Intrare:
3
5
5
5
Ieșire:
15
5.00
```

```
Intrare:
1
7
Ieșire:
7
7.00
```

```
Intrare:
3
-5
5
10
Ieșire:
10
3.33
```

Numerele negative funcționează la fel — suma poate fi mai mică decât oricare
valoare pozitivă individuală, iar media tot se rotunjește la 2 zecimale.
