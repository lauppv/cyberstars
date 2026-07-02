# Dificil · Spirală în matrice

Citește o matrice NxN de numere întregi și afișează elementele ei în **ordine spirală**: începe din colțul din stânga sus, deplasează-te la dreapta de-a lungul rândului de sus, apoi în jos pe coloana din dreapta, apoi la stânga de-a lungul rândului de jos, apoi în sus pe coloana din stânga, și repetă spre interior.

### Date de intrare

- Linia 1: un număr întreg `n` — dimensiunea matricei (1 <= n <= 10).
- Următoarele `n` linii: fiecare conținând `n` numere întregi separate prin spații.

### Rezultat

Toate elementele matricei în ordine spirală, separate prin spații.

### Exemple

```
Intrare:
3
1 2 3
4 5 6
7 8 9

Ieșire:
1 2 3 6 9 8 7 4 5
```

```
Intrare:
4
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16

Ieșire:
1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10
```

```
Intrare:
1
5

Ieșire:
5
```

O matrice 1x1 nu are unde să spiraleze — singurul element este întregul
rezultat.

```
Intrare:
2
1 2
3 4

Ieșire:
1 2 4 3
```
