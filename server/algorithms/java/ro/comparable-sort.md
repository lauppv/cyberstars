ai# Mediu · Sortează studenții

Creează o clasă **Student** care implementează `Comparable<Student>`. Fiecare student are un `nume` și o `medie` (double). Studenții trebuie sortați după medie în ordine **descrescătoare**. Dacă doi studenți au aceeași medie, sortează-i după nume în **ordine alfabetică**.

Citește studenții de la stdin, sortează-i și afișează fiecare student pe o linie separată.

### Date de intrare

- Linia 1: numărul de studenți N
- Pentru fiecare student, două linii:
  - Linia 1: numele (un singur cuvânt)
  - Linia 2: media (număr zecimal)

### Rezultat

N linii, fiecare în formatul: `nume medie` (media cu 1 zecimală), sortate după medie descrescător, apoi după nume crescător.

### Exemple

```
Intrare:
3
Alice
3.8
Bob
3.9
Carol
3.8

Ieșire:
Bob 3.9
Alice 3.8
Carol 3.8
```

```
Intrare:
2
Zoe
4.0
Amy
4.0

Ieșire:
Amy 4.0
Zoe 4.0
```

```
Intrare:
1
Max
3.5

Ieșire:
Max 3.5
```

Un singur student nu are nevoie de nicio comparație — este deja „sortat”.

```
Intrare:
3
Eve
3.5
Ana
3.5
Bob
3.5

Ieșire:
Ana 3.5
Bob 3.5
Eve 3.5
```

Când toate mediile sunt egale, întreaga listă cade înapoi pe ordinea alfabetică.
