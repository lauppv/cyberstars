# Mediu · Înmulțirea matricelor

Înmulțește două matrice **A** și **B** și afișează matricea rezultată **C**.

Înmulțirea matricelor este definită ca: `C[i][j] = suma A[i][k] * B[k][j]` pentru toți k. Numărul de coloane din A trebuie să fie egal cu numărul de rânduri din B.

Pentru acest exercițiu, matricele A și B sunt **hardcodate** direct în cod — nu se citește nimic de la stdin. Folosește:

```
A = [ [1, 2, 3],
      [4, 5, 6] ]

B = [ [7,  8],
      [9,  10],
      [11, 12] ]
```

### Date de intrare

Niciuna. Matricele sunt scrise direct în cod.

### Rezultat

- 2 linii, fiecare conținând 2 numere întregi separate prin spațiu — matricea produs C.

### Exemplu

```
Ieșire:
58 64
139 154
```

Verifică pe hârtie: `C[0][0] = 1*7 + 2*9 + 3*11 = 58`, `C[0][1] = 1*8 + 2*10 + 3*12 = 64`, etc.
