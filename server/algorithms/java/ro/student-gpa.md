# Ușor · Media studentului

Creează o clasă **Student** care stochează numele unui student și un tablou de note. Clasa trebuie să aibă o metodă `getMedie()` care calculează media tuturor notelor.

Citește numele studentului și notele de la stdin, creează un obiect `Student` și afișează media rotunjită la **2 zecimale**.

### Date de intrare

- Linia 1: numele studentului
- Linia 2: numărul de note N
- Următoarele N linii: câte o notă (număr întreg)

### Rezultat

O singură linie: media ca număr zecimal cu exact 2 zecimale.

### Exemple

```
Intrare:
Alice
4
90
85
92
88

Ieșire:
88.75
```

```
Intrare:
Bob
3
100
100
100

Ieșire:
100.00
```

```
Intrare:
Carol
1
95

Ieșire:
95.00
```

O singură notă — media este chiar acea notă, formatată tot la 2 zecimale.
