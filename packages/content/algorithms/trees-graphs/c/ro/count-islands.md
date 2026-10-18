O hartă e o grilă în care `#` e uscat și `.` e apă. O **insulă** e un grup de celule de uscat între care poți merge, pășind de pe o celulă de uscat doar pe o celulă de uscat vecină. Afișează câte insule are harta.

### Cum se scrie o grilă

Pe prima linie sunt numărul de rânduri și numărul de coloane. Urmează rândurile, de sus în jos, fiecare pe linia lui, fără spații. Rândurile și coloanele sunt numerotate de la `0`. Două celule sunt vecine când au o latură comună: sus, jos, stânga sau dreapta, niciodată pe diagonală.

Partea ascunsă a programului citește deja harta în variabilele globale `randuri`, `coloane` și `grila`, unde `grila[r][c]` e celula de pe rândul `r`, coloana `c`, apoi afișează ce întoarce `numara_insule`. Tu scrii `numara_insule`.

### Date de intrare

- Linia 1: numărul de rânduri și numărul de coloane, fiecare între 1 și 25.
- Următoarele linii: harta, scrisă cu `#` și `.`.

### Rezultat

Numărul de insule.

### Exemple

```
Intrare:
4 6
##..#.
#...##
..#...
.#.##.

Ieșire:
5
```

Celulele de pe rândul `2`, coloana `2` și de pe rândul `3`, coloana `1` se ating doar într-un colț, așa că sunt două insule.

```
Intrare:
3 3
###
#.#
###

Ieșire:
1
```

Un inel de uscat în jurul unui lac e tot o singură insulă.

```
Intrare:
2 3
...
...

Ieșire:
0
```
