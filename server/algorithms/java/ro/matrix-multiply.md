# Dificil · Înmulțirea matricelor

Înmulțește două matrice **A** și **B** și afișează matricea rezultată **C**.

Înmulțirea matricelor este definită ca: `C[i][j] = suma A[i][k] * B[k][j]` pentru toți k. Numărul de coloane din A trebuie să fie egal cu numărul de rânduri din B.

### Date de intrare

- Linia 1: două numere întregi `R1 C1` — dimensiunile matricei A
- Următoarele R1 linii: C1 numere întregi separate prin spațiu — rândurile matricei A
- Linia următoare: două numere întregi `R2 C2` — dimensiunile matricei B
- Următoarele R2 linii: C2 numere întregi separate prin spațiu — rândurile matricei B

### Rezultat

- R1 linii, fiecare conținând C2 numere întregi separate prin spațiu — matricea produs C.

### Exemple

```
Intrare:
2 3
1 2 3
4 5 6
3 2
7 8
9 10
11 12

Ieșire:
58 64
139 154
```

```
Intrare:
2 2
1 2
3 4
2 2
5 6
7 8

Ieșire:
19 22
43 50
```

```
Intrare:
1 1
3
1 1
4

Ieșire:
12
```

Cazul 1x1 este cazul de bază al formulei: `C[0][0] = A[0][0] * B[0][0]`.

### Indicii

- Matricea rezultat C are dimensiunile R1 x C2.
- Folosește trei bucle imbricate: `i` peste rândurile lui A, `j` peste coloanele lui B, `k` peste dimensiunea comună.
- `C[i][j] += A[i][k] * B[k][j]` pentru fiecare k de la 0 la C1-1.
- Inițializează matricea rezultat cu zerouri înainte de a calcula.
- Afișează fiecare rând pe propria linie, cu valorile separate prin spații.
