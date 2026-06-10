# Ușor · Produs de cumpărături

Creează o clasă **ShoppingItem** cu trei câmpuri: `name` (String), `price` (double) și `quantity` (int). Adaugă o metodă `getTotal()` care returnează `price * quantity`.

Citește N articole de la stdin. Pentru fiecare articol, creează un obiect `ShoppingItem`. La final, afișează costul total al tuturor articolelor, formatat la două zecimale.

### Date de intrare

- Linia 1: un număr întreg N — numărul de articole
- Următoarele N linii: un șir, un double și un număr întreg separate prin spații — name, price, quantity

### Rezultat

- Linia 1: `Total: X` (X formatat la două zecimale)

### Exemple

```
Intrare:
2
Apple 1.50 3
Bread 2.00 2

Ieșire:
Total: 8.50
```

```
Intrare:
3
Milk 3.99 1
Eggs 2.50 2
Butter 4.00 1

Ieșire:
Total: 12.99
```

### Indicii

- `getTotal()` ar trebui să returneze un `double` — înmulțește price cu quantity.
- Folosește `String.format("%.2f", total)` pentru a formata rezultatul la două zecimale.
- Acumulează totalul general însumând `getTotal()` pentru fiecare articol.
- Fiecare `ShoppingItem` este propriul său obiect — aceasta este POO în acțiune!
