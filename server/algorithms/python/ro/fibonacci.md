# Medium · Fibonacci

Afișează primele N numere Fibonacci. Șirul Fibonacci începe cu 0 și 1, iar fiecare număr următor este suma celor două precedente: 0, 1, 1, 2, 3, 5, 8, 13, ...

### Date de intrare

- Un singur număr întreg `n` (1 <= n <= 30).

### Rezultat

Primele `n` numere Fibonacci, separate prin spații.

### Exemple

```
Intrare:
5

Ieșire:
0 1 1 2 3
```

```
Intrare:
8

Ieșire:
0 1 1 2 3 5 8 13
```

### Indicii

- Începe cu două variabile: `a = 0` și `b = 1`.
- La fiecare pas, afișează `a`, apoi actualizează: `a, b = b, a + b`.
- Python suportă atribuirea de tuple, ceea ce face schimbarea elegantă.
- Fii atent la cazul limită `n = 1` — afișează doar `0`.
