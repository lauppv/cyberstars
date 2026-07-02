# Ușor · Media studentului

Creează o clasă **Student** care stochează numele unui student și un tablou de note. Clasa trebuie să aibă o metodă `getGPA()` care calculează media tuturor notelor.

Citește numele studentului și notele de la stdin, creează un obiect `Student` și afișează GPA rotunjit la **2 zecimale**.

### Date de intrare

- Linia 1: numele studentului (șir)
- Linia 2: notele separate prin spații (numere întregi)

### Rezultat

O singură linie: GPA ca număr zecimal cu exact 2 zecimale.

### Exemple

```
Intrare:
Alice
90 85 92 88

Ieșire:
88.75
```

```
Intrare:
Bob
100 100 100

Ieșire:
100.00
```

```
Intrare:
Carol
95

Ieșire:
95.00
```

O singură notă — media este chiar acea notă, formatată tot la 2 zecimale.
