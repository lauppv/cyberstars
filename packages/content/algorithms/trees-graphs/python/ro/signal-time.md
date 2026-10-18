O rețea are `n` turnuri unite prin cabluri, iar un semnal pleacă din turnul `s` în minutul `0`. Pe fiecare cablu semnalul face un anumit număr de minute, iar un turn trimite semnalul mai departe pe toate cablurile lui chiar în clipa în care îl primește. Afișează minutul în care primește semnalul ultimul turn, sau `-1` dacă un turn nu îl primește niciodată.

### Cum se scrie rețeaua

Pe prima linie sunt numărul de turnuri `n` și numărul de cabluri `m`. Urmează `m` linii, câte una pentru fiecare cablu: cele două turnuri pe care le unește și câte minute face semnalul pe el, în orice sens. Turnurile sunt numerotate de la `0` la `n - 1`.

```
0 ---7--- 1
|         |
1         2
|         |
2 ---1--- 3
```

Rețeaua aceasta se scrie:

```
4 4
0 1 7
1 3 2
0 2 1
2 3 1
```

Partea ascunsă a programului citește deja rețeaua în `vecini`, unde `vecini[u]` are câte o pereche `(v, cost)` pentru fiecare cablu din `u`: duce la `v` și durează `cost` minute, apoi afișează ce întoarce `timp_semnal`. Tu scrii `timp_semnal`.

### Date de intrare

- Linia 1: `n` și `m`. Sunt între 1 și 500 de turnuri și cel mult 2000 de cabluri.
- Următoarele `m` linii: cablurile, fiecare `u v cost`, unde `cost` e între 1 și 1000. Niciun cablu nu unește un turn cu el însuși și nicio pereche de turnuri nu e unită de două cabluri.
- Ultima linie: `s`.

### Rezultat

Minutul în care ultimul turn primește semnalul, sau `-1`.

### Exemple

```
Intrare:
4 4
0 1 7
1 3 2
0 2 1
2 3 1
0

Ieșire:
4
```

Cablul direct de la `0` la `1` durează 7 minute, dar prin `2` și `3` semnalul ajunge acolo în 1 + 1 + 2 = 4.

```
Intrare:
3 1
0 1 5
0

Ieșire:
-1
```

Turnul `2` nu are niciun cablu, așa că semnalul nu ajunge niciodată la el.

```
Intrare:
1 0
0

Ieșire:
0
```
