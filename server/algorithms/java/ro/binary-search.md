# Ușor · Căutare binară

Implementează **căutarea binară** pe un tablou sortat de numere întregi. Având un tablou sortat și o valoare țintă, găsește indicele țintei. Dacă ținta nu se află în tablou, afișează `-1`.

Folosește algoritmul clasic de căutare binară: menține doi indicatori `low` și `high`, verifică elementul din mijloc și restrânge intervalul de căutare la jumătate la fiecare pas.

### Date de intrare

- Linia 1: numărul întreg N — numărul de elemente
- Linia 2: N numere întregi separate prin spațiu, în ordine crescătoare
- Linia 3: numărul întreg T — valoarea țintă căutată

### Rezultat

- Indicele (începând de la 0) al țintei în tablou, sau `-1` dacă nu este găsită.

### Exemple

```
Intrare:
5
1 3 5 7 9
5

Ieșire:
2
```

```
Intrare:
4
2 4 6 8
5

Ieșire:
-1
```

### Indicii

- Pornește cu `low = 0` și `high = N - 1`.
- Calculează `mid = (low + high) / 2`.
- Dacă `arr[mid] == target`, ai găsit-o — afișează `mid`.
- Dacă `arr[mid] < target`, caută în jumătatea dreaptă: `low = mid + 1`.
- Dacă `arr[mid] > target`, caută în jumătatea stângă: `high = mid - 1`.
- Dacă `low > high`, ținta nu se află în tablou.
