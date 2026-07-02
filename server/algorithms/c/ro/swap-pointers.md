# Mediu · Interschimbare cu pointeri

Citește două numere întregi. Scrie o funcție `swap` care primește doi **pointeri la int** și interschimbă valorile lor. Apeleaz-o din `main`, apoi afișează valorile interschimbate.

Acest exercițiu antrenează transmiterea prin referință în C folosind pointeri și operatorul de dereferențiere `*`.

### Date de intrare

Două numere întregi pe o singură linie, separate printr-un spațiu.

### Rezultat

Cele două numere întregi interschimbate, separate prin spații, pe o singură linie.

### Exemple

```
Intrare:  3 7
Ieșire: 7 3
```

```
Intrare:  10 10
Ieșire: 10 10
```

```
Intrare:  -3 8
Ieșire: 8 -3
```

Numerele negative se interschimbă prin pointeri la fel ca orice altă valoare.

### Indicii

- Semnătura funcției tale `swap` ar trebui să fie `void swap(int *a, int *b)`.
- Folosește o variabilă temporară în interiorul lui `swap` pentru a păstra `*a` înainte de a-l suprascrie.
- Apeleaz-o cu `swap(&x, &y)` din `main`.
