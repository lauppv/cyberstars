Citește un întreg **N**, apoi citește **N** numere întregi. Sortează-le folosind algoritmul de **sortare prin inserție** și afișează rezultatul sortat.

Sortarea prin inserție funcționează construind o porțiune sortată a tabloului câte un element pe rând. Pentru fiecare element nou, deplasează elementele mai mari spre dreapta și inserează-l în poziția sa corectă. Se execută în timp O(N²), dar este eficientă pentru tablouri mici sau aproape sortate.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 1000)
- Următoarele `N` linii: câte un număr întreg

### Rezultat

Cele `N` numere întregi sortate crescător, separate prin spații, pe o singură linie.

### Exemple

```
Intrare:
5
12
11
13
5
6
Ieșire: 5 6 11 12 13
```

```
Intrare:
4
4
3
2
1
Ieșire: 1 2 3 4
```

```
Intrare:
1
9
Ieșire: 9
```

```
Intrare:
4
1
1
2
2
Ieșire: 1 1 2 2
```

Un tablou deja sortat (cu duplicate) nu necesită nicio deplasare.
