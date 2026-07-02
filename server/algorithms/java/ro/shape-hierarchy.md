# Mediu · Ierarhia formelor

Creează o clasă **abstractă** `Shape` cu o metodă abstractă `getArea()`. Implementează două subclase: `Circle` (cu radius) și `Rectangle` (cu width și height).

Citește formele de la stdin, creează obiectele corespunzătoare și afișează **aria totală** a tuturor formelor, rotunjită la 2 zecimale.

### Date de intrare

- Linia 1: numărul de forme N
- Următoarele N linii: fie `circle RADIUS`, fie `rectangle WIDTH HEIGHT`

### Rezultat

O singură linie: `Total: X` unde X este suma tuturor ariilor, formatată la 2 zecimale.

### Exemple

```
Intrare:
3
circle 5
rectangle 4 6
circle 3

Ieșire:
Total: 130.81
```

```
Intrare:
1
rectangle 10 10

Ieșire:
Total: 100.00
```

```
Intrare:
0

Ieșire:
Total: 0.00
```

Fără nicio formă, suma pornește și rămâne la zero — se afișează totuși `Total: 0.00`.

### Indicii

- Folosește `Math.PI` pentru aria cercului (pi _ r _ r).
- Declară `Shape` ca `abstract class Shape` cu `abstract double getArea()`.
- Stochează toate formele într-un `ArrayList<Shape>` — acesta este **polimorfismul** în acțiune.
- Însumează `getArea()` pentru fiecare formă din listă.
