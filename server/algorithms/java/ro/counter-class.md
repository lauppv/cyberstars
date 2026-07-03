# Ușor · Clasă contor

Creează o clasă **Contor** care ține evidența unei valori întregi. Aceasta trebuie să suporte trei operații:

- `increment()` — adaugă 1 la valoare
- `decrement()` — scade 1 din valoare
- `getValue()` — returnează valoarea curentă

Contorul pornește de la **0**. Citește comenzile de la stdin (una pe linie): `inc`, `dec` sau `get`. Pentru fiecare comandă `get`, afișează valoarea curentă pe o linie nouă.

### Date de intrare

- Linia 1: un număr întreg N — numărul de comenzi
- Următoarele N linii: o comandă (`inc`, `dec` sau `get`)

### Rezultat

- Pentru fiecare comandă `get`, afișează valoarea curentă a contorului pe o linie separată.

### Exemple

```
Intrare:
5
inc
inc
get
dec
get

Ieșire:
2
1
```

```
Intrare:
4
dec
dec
dec
get

Ieșire:
-3
```

```
Intrare:
1
get

Ieșire:
0
```

Apelarea `get` înainte de orice `inc`/`dec` returnează valoarea de start, 0.

```
Intrare:
5
inc
dec
inc
dec
get

Ieșire:
0
```

Incrementările și decrementările se anulează reciproc — contorul revine la 0.
