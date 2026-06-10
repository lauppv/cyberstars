# Ușor · Numără caracterele

Citește un șir (un singur cuvânt) și un caracter. Numără de câte ori apare acel caracter în șir și afișează numărul.

Acest exercițiu antrenează parcurgerea unui șir C și compararea caracterelor.

### Date de intrare

- Prima linie: un singur cuvânt (maxim 1000 de caractere)
- A doua linie: un singur caracter

### Rezultat

Un singur întreg: numărul de apariții ale caracterului în șir.

### Exemple

```
Intrare:
banana
a
Ieșire: 3
```

```
Intrare:
hello
z
Ieșire: 0
```

### Indicii

- Citește șirul cu `scanf("%s", str)` și caracterul cu `scanf(" %c", &ch)` (observă spațiul înainte de `%c` pentru a sări peste spațiile albe).
- Parcurge fiecare caracter și compară-l cu `ch`.
