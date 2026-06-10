# Medium · Matrix Transpose

Citește un întreg **N**, apoi citește o matrice de numere întregi de dimensiune **N×N**. Afișează **transpusa** ei (rândurile devin coloane).

Acest exercițiu antrenează lucrul cu tablouri bidimensionale în C și buclele imbricate.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 20)
- Următoarele `N` linii: fiecare cu `N` numere întregi separate prin spații

### Rezultat

`N` linii, fiecare cu `N` numere întregi separate prin spații, reprezentând matricea transpusă.

### Exemple

```
Intrare:
2
1 2
3 4
Ieșire:
1 3
2 4
```

```
Intrare:
3
1 2 3
4 5 6
7 8 9
Ieșire:
1 4 7
2 5 8
3 6 9
```

### Indicii

- Folosește un tablou bidimensional: `int mat[20][20]`.
- Transpunerea schimbă rândurile cu coloanele: elementul `[i][j]` devine `[j][i]`.
- Poți fie să construiești o matrice nouă, fie să afișezi direct parcurgând coloanele apoi rândurile.
