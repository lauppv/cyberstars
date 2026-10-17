Un labirint e o grilă în care `#` e un perete și `.` o celulă liberă. Pornești de pe celula marcată cu `A` și vrei să ajungi la celula marcată cu `B`, iar fiecare pas te duce pe o celulă vecină care nu e perete. Afișează cei mai puțini pași care te duc de la `A` la `B`, sau `-1` dacă niciun drum nu duce acolo.

### Cum se scrie o grilă

Pe prima linie sunt numărul de rânduri și numărul de coloane. Urmează rândurile, de sus în jos, fiecare pe linia lui, fără spații. Rândurile și coloanele sunt numerotate de la `0`. Două celule sunt vecine când au o latură comună: sus, jos, stânga sau dreapta, niciodată pe diagonală.

Codul de început citește deja labirintul în `grila`, unde `grila[r][c]` e celula de pe rândul `r`, coloana `c`, apoi afișează ce întoarce `ceiMaiPutiniPasi`. Tu scrii `ceiMaiPutiniPasi`.

### Date de intrare

- Linia 1: numărul de rânduri și numărul de coloane, fiecare între 1 și 25.
- Următoarele linii: labirintul, scris cu `#`, `.`, `A` și `B`. Există exact un `A` și un `B`.

### Rezultat

Cei mai puțini pași de la `A` la `B`, sau `-1`.

### Exemple

```
Intrare:
5 7
A..#...
.#.#.#.
.#...#.
.####..
......B

Ieșire:
10
```

În jos pe marginea din stânga și apoi pe ultimul rând sunt 10 pași. Drumul pe sus are 14.

```
Intrare:
3 3
A#.
##.
..B

Ieșire:
-1
```

Pereții îl închid pe `A`.

```
Intrare:
1 2
BA

Ieșire:
1
```
