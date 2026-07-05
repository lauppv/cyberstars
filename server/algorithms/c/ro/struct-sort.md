# Mediu · Sortează studenții

Citește **N** studenți, fiecare cu un **nume** (un singur cuvânt) și o **notă** (număr întreg). Sortează-i după notă în ordine **crescătoare**. Dacă doi studenți au aceeași notă, păstrează ordinea lor originală (sortare stabilă). Afișează lista sortată.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 50)
- Pentru fiecare student, două linii:
  - Linia 1: numele (un singur cuvânt)
  - Linia 2: nota (număr întreg)

### Rezultat

`N` linii, fiecare cu numele și nota (separate prin spațiu), sortate după notă crescător.

### Exemple

```
Intrare:
3
Alice
85
Bob
72
Charlie
90
Ieșire:
Bob 72
Alice 85
Charlie 90
```

```
Intrare:
2
Dan
50
Eve
50
Ieșire:
Dan 50
Eve 50
```

```
Intrare:
1
Alice
85
Ieșire:
Alice 85
```

```
Intrare:
3
Amy
70
Zoe
70
Bob
70
Ieșire:
Amy 70
Zoe 70
Bob 70
```

Când toate notele sunt egale, sortarea stabilă păstrează ordinea originală
din intrare — observă că **nu** este alfabetică.
