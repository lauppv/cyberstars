# Dificil · Iterator pentru interval de numere

Implementează interfețele **Iterable** și **Iterator** pentru a crea o clasă `NumberRange` care iterează peste un interval de numere întregi.

`NumberRange` primește o valoare `start` și o valoare `end` și îți permite să iterezi peste toate numerele întregi de la `start` la `end` (inclusiv) folosind o buclă for-each.

Citește start și end de la stdin, creează un `NumberRange` și afișează fiecare număr pe o linie separată.

### Date de intrare

- Linia 1: două numere întregi — start și end

### Rezultat

Fiecare număr de la start la end (inclusiv), câte unul pe linie.

### Exemple

```
Intrare:
1 5

Ieșire:
1
2
3
4
5
```

```
Intrare:
3 3

Ieșire:
3
```

```
Intrare:
-2 2

Ieșire:
-2
-1
0
1
2
```
