# Mediu · Tablou dinamic

Citește un întreg **N**, apoi citește **N** numere întregi. Stochează-le într-un tablou **alocat dinamic** (folosind `malloc`). Afișează **suma** și **media** (cu 2 zecimale) numerelor. Nu uita să eliberezi memoria cu `free`.

Acest exercițiu antrenează alocarea dinamică de memorie cu `malloc` și `free`.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 1000)
- A doua linie: `N` numere întregi separate prin spații

### Rezultat

Două linii:

- Prima linie: suma (întreg)
- A doua linie: media (număr în virgulă mobilă, 2 zecimale)

### Exemple

```
Intrare:
4
10 20 30 40
Ieșire:
100
25.00
```

```
Intrare:
3
5 5 5
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
-5 5 10
Ieșire:
10
3.33
```

Numerele negative funcționează la fel — suma poate fi mai mică decât oricare
valoare pozitivă individuală, iar media tot se rotunjește la 2 zecimale.

### Indicii

- Alocă cu `int *arr = (int *)malloc(n * sizeof(int));`
- Calculează suma într-o buclă, apoi împarte la `n` (convertit la `double`) pentru a obține media.
- Folosește `printf("%.2f\n", avg)` pentru 2 zecimale.
- Eliberează întotdeauna memoria cu `free(arr)` la final.
