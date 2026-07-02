# Suma unei liste

Având un număr `N` urmat de `N` numere (unul pe linie), afișează **suma** lor.

### Date de intrare

- Prima linie conține un număr întreg `N`.
- Următoarele `N` linii conțin fiecare câte un număr întreg.

### Rezultat

Afișează suma celor `N` numere.

### Exemple

```
Intrare:
3
10
20
30
Ieșire: 60
```

```
Intrare:
4
1
2
3
4
Ieșire: 10
```

```
Intrare:
1
42
Ieșire: 42
```

Cu `N = 1`, suma este chiar acel singur număr.

```
Intrare:
3
-5
-10
15
Ieșire: 0
```

### Indicii

- Folosește o buclă `for` cu `range(n)` pentru a citi fiecare număr.
- Păstrează un total curent adăugând fiecare număr la o variabilă acumulator.
- Poți de asemenea să colectezi numerele într-o listă și să folosești funcția încorporată `sum()`.
