Citește un tablou sortat de **N** numere întregi și o valoare căutată. Găsește valoarea folosind **căutarea binară** și afișează indicele ei (începând de la 0), sau **-1** dacă valoarea nu este găsită.

Căutarea binară funcționează înjumătățind în mod repetat intervalul de căutare. Compară valoarea căutată cu elementul din mijloc: dacă sunt egale, ai găsit-o; dacă este mai mică, caută în jumătatea stângă; dacă este mai mare, caută în jumătatea dreaptă. Se execută în timp O(log N).

### Date de intrare

- Prima linie: un întreg `N` (1 <= N <= 2·10^4)
- Următoarele `N` linii: câte un număr întreg (fiecare între -10^6 și 10^6), sortate crescător
- Linia următoare: un întreg `cautat` (între -10^6 și 10^6), valoarea de găsit

### Rezultat

Un singur întreg: indicele (începând de la 0) al valorii căutate în tablou, sau `-1` dacă nu este găsită.

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
Ieșire: 2
```

```
Intrare:
4
10
20
30
40
25
Ieșire: -1
```

```visual
{
  "type": "array",
  "values": [10, 20, 30, 40],
  "caption": "Tabloul este sortat. stanga și dreapta marchează partea în care încă mai căutăm, iar mijloc este mijlocul ei. Când numărul din mijloc nu e 25, jumătatea în care 25 nu poate fi se estompează și căutăm în cealaltă.",
  "markers": ["stanga = {i}", "mijloc = {i}", "dreapta = {i}"],
  "steps": [
    {"title": "Pasul 1", "at": [0, 1, 3], "compare": [1], "ask": "mijloc = (0 + 3) / 2 = 1, iar numărul de acolo este 20. Este 20 < 25?", "caption": "Da, deci 25 poate fi doar în dreapta lui mijloc: stanga = mijloc + 1 = 2", "move": [2, null, 3], "range": [2, 3]},
    {"title": "Pasul 2", "at": [2, 2, 3], "compare": [2], "ask": "mijloc = (2 + 3) / 2 = 2, iar numărul de acolo este 30. Este 30 < 25?", "caption": "Nu, 30 > 25, deci 25 poate fi doar în stânga lui mijloc: dreapta = mijloc - 1 = 1", "move": [2, null, 1], "range": [2, 1]},
    {"title": "Pasul 3", "caption": "stanga = 2 a trecut de dreapta = 1, deci nu mai e nimic de căutat. 25 nu e în tablou: afișăm -1"}
  ]
}
```

```
Intrare:
1
5
5
Ieșire: 0
```

Un tablou cu un singur element funcționează la fel: `stanga` și `dreapta` pornesc amândoi de la 0.

```
Intrare:
1
5
3
Ieșire: -1
```
