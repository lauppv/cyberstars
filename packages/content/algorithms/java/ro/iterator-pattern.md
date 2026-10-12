Implementează interfețele **Iterable** și **Iterator** pentru a crea o clasă `IntervalNumere` care iterează peste un interval de numere întregi.

`IntervalNumere` primește o valoare `inceput` și o valoare `sfarsit` și îți permite să iterezi peste toate numerele întregi de la `inceput` la `sfarsit` (inclusiv) folosind o buclă for-each.

Citește începutul și sfârșitul de la stdin, creează un `IntervalNumere` și afișează fiecare număr pe o linie separată.

### Date de intrare

- Linia 1: începutul intervalului (număr întreg, -10^9 <= început <= 10^9)
- Linia 2: sfârșitul intervalului (număr întreg, început <= sfârșit <= 10^9)
- Începutul nu este niciodată mai mare decât sfârșitul, iar intervalul are cel mult 2·10^4 + 1 numere (sfârșit - început <= 2·10^4)

### Rezultat

Fiecare număr de la început la sfârșit (inclusiv), câte unul pe linie.

### Exemple

```
Intrare:
1
5

Ieșire:
1
2
3
4
5
```

```
Intrare:
3
3

Ieșire:
3
```

```
Intrare:
-2
2

Ieșire:
-2
-1
0
1
2
```
