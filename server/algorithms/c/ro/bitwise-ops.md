# Mediu · Putere a lui doi pe biți

Citește un întreg **N**, apoi citește **N** numere întregi pozitive. Pentru fiecare număr, afișează `"DA"` dacă este o **putere a lui 2**, sau `"NU"` în caz contrar. Trebuie să folosești **operatori pe biți** pentru verificare — fără bucle care numără împărțiri.

Un număr `x` este o putere a lui 2 dacă și numai dacă `x > 0` și `(x & (x - 1)) == 0`.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 100)
- Următoarele `N` linii: câte un număr întreg pozitiv

### Rezultat

`N` linii, fiecare `DA` sau `NU`.

### Exemple

```
Intrare:
4
1
2
3
4
Ieșire:
DA
DA
NU
DA
```

```
Intrare:
3
16
15
1024
Ieșire:
DA
NU
DA
```

```
Intrare:
2
1073741824
1073741823
Ieșire:
DA
NU
```

`1073741824` este 2^30. `1073741823` este cu unu mai puțin — în binar
înseamnă treizeci de biți de `1`, ceea ce e cât se poate de departe de
„exact un bit setat”.
