# Dificil · Putere a lui doi pe biți

Citește un întreg **N**, apoi citește **N** numere întregi pozitive. Pentru fiecare număr, afișează `"YES"` dacă este o **putere a lui 2**, sau `"NO"` în caz contrar. Trebuie să folosești **operatori pe biți** pentru verificare — fără bucle care numără împărțiri.

Un număr `x` este o putere a lui 2 dacă și numai dacă `x > 0` și `(x & (x - 1)) == 0`.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 100)
- Următoarele `N` linii: câte un număr întreg pozitiv

### Rezultat

`N` linii, fiecare `YES` sau `NO`.

### Exemple

```
Intrare:
4
1
2
3
4
Ieșire:
YES
YES
NO
YES
```

```
Intrare:
3
16
15
1024
Ieșire:
YES
NO
YES
```

### Indicii

- Trucul pe biți: `(n & (n - 1)) == 0` este adevărat doar pentru puterile lui 2 (și zero, dar datele de intrare sunt pozitive).
- `&` este operatorul ȘI pe biți în C.
- Puterile lui 2 în binar au exact un bit setat: `1, 10, 100, 1000, ...`
