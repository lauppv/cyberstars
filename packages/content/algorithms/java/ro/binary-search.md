Implementează **căutarea binară** pe un tablou sortat de numere întregi. Având un tablou sortat și o valoare țintă, găsește indicele țintei. Dacă ținta nu se află în tablou, afișează `-1`.

Folosește algoritmul clasic de căutare binară: menține doi indicatori `jos` și `sus`, verifică elementul din mijloc și restrânge intervalul de căutare la jumătate la fiecare pas.

### Date de intrare

- Linia 1: numărul întreg N, numărul de elemente (1 <= N <= 2·10^4)
- Următoarele N linii: câte un număr întreg, în ordine strict crescătoare (fără duplicate), fiecare între -10^6 și 10^6
- Linia următoare: numărul întreg T, valoarea țintă căutată (-10^6 <= T <= 10^6)

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

```visual
{
  "type": "array",
  "values": [2, 4, 6, 8],
  "caption": "Tabloul este sortat. jos și sus marchează partea în care încă mai căutăm, iar mijloc este mijlocul ei. Când numărul din mijloc nu e 5, jumătatea în care 5 nu poate fi se estompează și căutăm în cealaltă.",
  "markers": ["jos = {i}", "mijloc = {i}", "sus = {i}"],
  "steps": [
    {"title": "Pasul 1", "at": [0, 1, 3], "compare": [1], "ask": "mijloc = (0 + 3) / 2 = 1, iar numărul de acolo este 4. Este 4 < 5?", "caption": "Da, deci 5 poate fi doar în dreapta lui mijloc: jos = mijloc + 1 = 2", "move": [2, null, 3], "range": [2, 3]},
    {"title": "Pasul 2", "at": [2, 2, 3], "compare": [2], "ask": "mijloc = (2 + 3) / 2 = 2, iar numărul de acolo este 6. Este 6 < 5?", "caption": "Nu, 6 > 5, deci 5 poate fi doar în stânga lui mijloc: sus = mijloc - 1 = 1", "move": [2, null, 1], "range": [2, 1]},
    {"title": "Pasul 3", "caption": "jos = 2 a trecut de sus = 1, deci nu mai e nimic de căutat. 5 nu e în tablou: afișăm -1"}
  ]
}
```

```
Intrare:
1
5
5

Ieșire:
0
```

Un tablou cu un singur element funcționează la fel: `jos` și `sus` pornesc amândoi de la 0.

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

Ținta poate fi chiar primul sau ultimul element. Căutarea tot se restrânge
corect până la el.
