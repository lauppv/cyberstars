# Mediu · Sortează studenții

Citește **N** studenți, fiecare cu un **nume** (un singur cuvânt) și o **notă** (număr întreg). Sortează-i după notă în ordine **crescătoare**. Dacă doi studenți au aceeași notă, păstrează ordinea lor originală (sortare stabilă). Afișează lista sortată.

Acest exercițiu antrenează definirea și folosirea unei `struct` în C, precum și sortarea unui tablou de structuri.

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 50)
- Următoarele `N` linii: un nume (șir, fără spații) și o notă (număr întreg), separate printr-un spațiu

### Rezultat

`N` linii, fiecare cu numele și nota, sortate după notă crescător.

### Exemple

```
Intrare:
3
Alice 85
Bob 72
Charlie 90
Ieșire:
Bob 72
Alice 85
Charlie 90
```

```
Intrare:
2
Dan 50
Eve 50
Ieșire:
Dan 50
Eve 50
```

### Indicii

- Definește o structură: `struct Student { char name[51]; int grade; };`
- Folosește sortarea prin metoda bulelor sau sortarea prin selecție pentru a sorta tabloul după câmpul `grade`.
- Pentru o sortare stabilă, sortarea prin metoda bulelor funcționează bine — păstrează ordinea elementelor egale.
