# Medium · Sort Students

Creează o clasă **Student** care implementează `Comparable<Student>`. Fiecare student are un `name` și un `gpa` (double). Studenții trebuie sortați după GPA în ordine **descrescătoare**. Dacă doi studenți au același GPA, sortează-i după nume în **ordine alfabetică**.

Citește studenții de la stdin, sortează-i și afișează fiecare student pe o linie separată.

### Date de intrare

- Linia 1: numărul de studenți N
- Următoarele N linii: `name gpa` (numele este un singur cuvânt, gpa este un număr zecimal)

### Rezultat

N linii, fiecare în formatul: `name gpa` (GPA cu 1 zecimală), sortate după GPA descrescător, apoi după nume crescător.

### Exemple

```
Intrare:
3
Alice 3.8
Bob 3.9
Carol 3.8

Ieșire:
Bob 3.9
Alice 3.8
Carol 3.8
```

```
Intrare:
2
Zoe 4.0
Amy 4.0

Ieșire:
Amy 4.0
Zoe 4.0
```

### Indicii

- Implementează `compareTo` în clasa Student.
- Pentru GPA descrescător: compară GPA-ul celuilalt cu acest GPA folosind `Double.compare()`.
- La egalitate, folosește `this.name.compareTo(other.name)`.
- Folosește `Collections.sort()` sau `Arrays.sort()` după ce ai colectat studenții.
- Formatează GPA cu `String.format("%.1f", gpa)`.
