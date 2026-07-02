# Mediu · Sortare prin inserție

Citește o listă de numere și sortează-le folosind algoritmul **insertion sort** (sortare prin inserție). Insertion sort funcționează construind o porțiune sortată a listei câte un element pe rând: alege următorul element nesortat și inserează-l în poziția corectă în porțiunea sortată.

### Date de intrare

- Linia 1: un număr întreg `n` — câte numere sunt.
- Linia 2: `n` numere întregi separate prin spații.

### Rezultat

Numerele sortate, separate prin spații.

### Exemple

```
Intrare:
5
5 3 8 1 2

Ieșire:
1 2 3 5 8
```

```
Intrare:
4
4 3 2 1

Ieșire:
1 2 3 4
```

```
Intrare:
1
9

Ieșire:
9
```

O listă cu un singur element este deja sortată.

```
Intrare:
4
3 1 3 1

Ieșire:
1 1 3 3
```

Valorile duplicate sunt păstrate — sortarea trebuie doar să plaseze valorile
egale una lângă alta.

### Indicii

- Începe de la al doilea element (indicele 1). Compară-l cu elementele din stânga sa și deplasează elementele mai mari o poziție la dreapta.
- Folosește o buclă `while` în interiorul buclei `for` pentru a găsi poziția corectă de inserție.
- Bucla exterioară rulează de la indicele 1 la n-1; bucla interioară se deplasează spre stânga cât timp elementul curent este mai mic.
- **Nu** folosi funcțiile încorporate `sort()` sau `sorted()` din Python — implementează singur algoritmul!
