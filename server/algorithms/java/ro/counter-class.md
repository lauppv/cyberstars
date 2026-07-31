Creează o clasă **Contor** care ține evidența unei valori întregi. Aceasta trebuie să suporte trei operații:

- `creste()` — adaugă 1 la valoare
- `scade()` — scade 1 din valoare
- `getValoare()` — returnează valoarea curentă

Contorul pornește de la **0**. Citește comenzile de la stdin (una pe linie): `creste`, `scade` sau `arata`. Pentru fiecare comandă `arata`, afișează valoarea curentă pe o linie nouă.

### Date de intrare

- Linia 1: un număr întreg N — numărul de comenzi
- Următoarele N linii: o comandă (`creste`, `scade` sau `arata`)

### Rezultat

- Pentru fiecare comandă `arata`, afișează valoarea curentă a contorului pe o linie separată.

### Exemple

```
Intrare:
5
creste
creste
arata
scade
arata

Ieșire:
2
1
```

```
Intrare:
4
scade
scade
scade
arata

Ieșire:
-3
```

```
Intrare:
1
arata

Ieșire:
0
```

Apelarea `arata` înainte de orice `creste`/`scade` returnează valoarea de start, 0.

```
Intrare:
5
creste
scade
creste
scade
arata

Ieșire:
0
```

Incrementările și decrementările se anulează reciproc — contorul revine la 0.
