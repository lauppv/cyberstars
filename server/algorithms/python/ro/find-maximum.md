# Găsește maximul

Având o listă de numere, găsește și afișează **cel mai mare** dintre ele.

### Date de intrare

- Linia 1: un număr întreg `n` — câte numere sunt.
- Linia 2: `n` numere întregi separate prin spații.

### Rezultat

Cel mai mare număr din listă.

### Exemple

```
Intrare:
5
3 1 7 2 5

Ieșire:
7
```

```
Intrare:
3
-10 -3 -7

Ieșire:
-3
```

```
Intrare:
1
42

Ieșire:
42
```

Cu un singur număr, acel număr este automat maximul.

```
Intrare:
4
5 5 5 5

Ieșire:
5
```

### Indicii

- Folosește `.split()` pentru a împărți a doua linie într-o listă de șiruri, apoi convertește fiecare la `int`.
- Python are o funcție încorporată `max()` — dar încearcă mai întâi să o rezolvi cu o buclă!
- Începe presupunând că primul element este maximul, apoi compară cu restul.
