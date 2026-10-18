O ladă cu fructe e o grilă în care `o` e un fruct proaspăt, `x` unul stricat și `.` un loc gol. În fiecare minut, fiecare fruct proaspăt vecin cu unul stricat se strică și el. Afișează câte minute trec până nu mai rămâne niciun fruct proaspăt: `0` dacă nu e niciunul de la început, `-1` dacă un fruct nu se strică niciodată.

### Cum se scrie o grilă

Pe prima linie sunt numărul de rânduri și numărul de coloane. Urmează rândurile, de sus în jos, fiecare pe linia lui, fără spații. Rândurile și coloanele sunt numerotate de la `0`. Două celule sunt vecine când au o latură comună: sus, jos, stânga sau dreapta, niciodată pe diagonală.

Partea ascunsă a programului citește deja lada în `grila`, unde `grila[r][c]` e celula de pe rândul `r`, coloana `c`, apoi afișează ce întoarce `minute_pana_se_strica`. Tu scrii `minute_pana_se_strica`.

### Date de intrare

- Linia 1: numărul de rânduri și numărul de coloane, fiecare între 1 și 25.
- Următoarele linii: lada, scrisă cu `o`, `x` și `.`.

### Rezultat

Minutele până nu mai rămâne niciun fruct proaspăt, sau `-1`.

### Exemple

```
Intrare:
3 4
xoo.
.oo.
..ox

Ieșire:
2
```

În minutul 1 se strică fructul din dreapta lui `x` de sus și cel din stânga lui `x` de jos. În minutul 2 se strică celelalte trei.

```
Intrare:
1 4
xo.o

Ieșire:
-1
```

Un loc gol ține ultimul fruct departe de celelalte, așa că rămâne proaspăt.

```
Intrare:
2 2
..
.x

Ieșire:
0
```
