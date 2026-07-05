# Ușor · Produs de cumpărături

Creează o clasă **Articol** cu trei câmpuri: `nume` (String), `pret` (double) și `cantitate` (int). Adaugă o metodă `getTotal()` care returnează `pret * cantitate`.

Citește N articole de la stdin. Pentru fiecare articol, creează un obiect `Articol`. La final, afișează costul total al tuturor articolelor, formatat la două zecimale.

### Date de intrare

- Linia 1: un număr întreg N — numărul de articole
- Pentru fiecare articol, trei linii:
  - Linia 1: numele (un singur cuvânt)
  - Linia 2: prețul (număr zecimal)
  - Linia 3: cantitatea (număr întreg)

### Rezultat

- Linia 1: `Total: X` (X formatat la două zecimale)

### Exemple

```
Intrare:
2
Mar
1.50
3
Paine
2.00
2

Ieșire:
Total: 8.50
```

```
Intrare:
3
Lapte
3.99
1
Oua
2.50
2
Unt
4.00
1

Ieșire:
Total: 12.99
```

```
Intrare:
1
Apa
0.99
1

Ieșire:
Total: 0.99
```

Un singur articol cu cantitatea 1 — totalul este chiar prețul său.
