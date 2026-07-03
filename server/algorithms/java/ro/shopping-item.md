# Ușor · Produs de cumpărături

Creează o clasă **ShoppingItem** cu trei câmpuri: `nume` (String), `pret` (double) și `cantitate` (int). Adaugă o metodă `getTotal()` care returnează `pret * cantitate`.

Citește N articole de la stdin. Pentru fiecare articol, creează un obiect `ShoppingItem`. La final, afișează costul total al tuturor articolelor, formatat la două zecimale.

### Date de intrare

- Linia 1: un număr întreg N — numărul de articole
- Următoarele N linii: un șir, un double și un număr întreg separate prin spații — nume, pret, cantitate

### Rezultat

- Linia 1: `Total: X` (X formatat la două zecimale)

### Exemple

```
Intrare:
2
Mar 1.50 3
Paine 2.00 2

Ieșire:
Total: 8.50
```

```
Intrare:
3
Lapte 3.99 1
Oua 2.50 2
Unt 4.00 1

Ieșire:
Total: 12.99
```

```
Intrare:
1
Apa 0.99 1

Ieșire:
Total: 0.99
```

Un singur articol cu cantitatea 1 — totalul este chiar prețul său.
