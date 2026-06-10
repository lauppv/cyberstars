# Easy · Rectangle Calculator

Creează o clasă **Rectangle** cu câmpurile `width` și `height`. Adaugă metodele `getArea()` și `getPerimeter()` care returnează aria și perimetrul dreptunghiului.

Citește width și height de la stdin, creează un obiect `Rectangle` și afișează aria și perimetrul pe linii separate.

### Date de intrare

- Linia 1: două numere întregi separate printr-un spațiu — width și height

### Rezultat

- Linia 1: `Area: X`
- Linia 2: `Perimeter: X`

### Exemple

```
Intrare:
5 3

Ieșire:
Area: 15
Perimeter: 16
```

```
Intrare:
10 10

Ieșire:
Area: 100
Perimeter: 40
```

### Indicii

- Aria = width \* height.
- Perimetrul = 2 \* (width + height).
- Clasa ar trebui să încapsuleze câmpurile și să expună metode de tip getter.
- Folosește aritmetică cu numere întregi — nu sunt necesare zecimale.
