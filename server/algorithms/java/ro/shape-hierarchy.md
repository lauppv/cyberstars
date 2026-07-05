# Mediu · Ierarhia formelor

Creează o clasă **abstractă** `Forma` cu o metodă abstractă `getArie()`. Implementează două subclase: `Cerc` (cu raza) și `Dreptunghi` (cu latime și inaltime).

Citește formele de la stdin, creează obiectele corespunzătoare și afișează **aria totală** a tuturor formelor, rotunjită la 2 zecimale.

### Date de intrare

- Linia 1: numărul de forme N
- Pentru fiecare formă:
  - Linia 1: tipul (`cerc` sau `dreptunghi`)
  - Pentru `cerc`, linia 2: raza (număr zecimal)
  - Pentru `dreptunghi`, linia 2: latimea, linia 3: înălțimea (numere zecimale)

### Rezultat

O singură linie: `Total: X` unde X este suma tuturor ariilor, formatată la 2 zecimale.

### Exemple

```
Intrare:
3
cerc
5
dreptunghi
4
6
cerc
3

Ieșire:
Total: 130.81
```

```
Intrare:
1
dreptunghi
10
10

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
