Citește o listă de numere și sortează-le folosind algoritmul **insertion sort** (sortare prin inserție). Insertion sort funcționează construind o porțiune sortată a listei câte un element pe rând: alege următorul element nesortat și inserează-l în poziția corectă în porțiunea sortată.

### Date de intrare

- Linia 1: un număr întreg `n` — câte numere sunt.
- Linia 2: `n` numere întregi separate prin spații.

### Rezultat

Numerele sortate, separate prin spații.

### Exemple

```
Intrare:
5
5 3 8 1 2

Ieșire:
1 2 3 5 8
```

```
Intrare:
4
4 3 2 1

Ieșire:
1 2 3 4
```

```
Intrare:
1
9

Ieșire:
9
```

O listă cu un singur element este deja sortată.

```
Intrare:
4
3 1 3 1

Ieșire:
1 1 3 3
```

Valorile duplicate sunt păstrate — sortarea trebuie doar să plaseze valorile
egale una lângă alta.
