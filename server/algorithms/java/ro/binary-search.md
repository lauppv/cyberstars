Implementează **căutarea binară** pe un tablou sortat de numere întregi. Având un tablou sortat și o valoare țintă, găsește indicele țintei. Dacă ținta nu se află în tablou, afișează `-1`.

Folosește algoritmul clasic de căutare binară: menține doi indicatori `jos` și `sus`, verifică elementul din mijloc și restrânge intervalul de căutare la jumătate la fiecare pas.

### Date de intrare

- Linia 1: numărul întreg N — numărul de elemente
- Următoarele N linii: câte un număr întreg, în ordine crescătoare
- Linia următoare: numărul întreg T — valoarea țintă căutată

### Rezultat

- Indicele (începând de la 0) al țintei în tablou, sau `-1` dacă nu este găsită.

### Exemple

```
Intrare:
5
1
3
5
7
9
5

Ieșire:
2
```

```
Intrare:
4
2
4
6
8
5

Ieșire:
-1
```

```
Intrare:
1
5
5

Ieșire:
0
```

Un tablou cu un singur element funcționează la fel — `jos` și `sus` pornesc amândoi de la 0.

```
Intrare:
1
5
3

Ieșire:
-1
```

```
Intrare:
6
1
2
3
4
5
6
1

Ieșire:
0
```

Ținta poate fi chiar primul sau ultimul element — căutarea tot se restrânge
corect până la el.
