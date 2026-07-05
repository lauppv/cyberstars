# Mediu · Pare și impare cu fork

Un părinte și un copil își împart munca: copilul numără numerele pare, iar părintele numerele impare. Copilul îi trimite părintelui rezultatul lui printr-un pipe, iar părintele afișează amândouă numerele.

Trimitem un `int` prin pipe cu **write(p[1], &pare, sizeof(int))** și îl citim la celălalt capăt cu **read(p[0], &pare, sizeof(int))** — pipe-urile transportă orice octeți, nu doar text.

### Date de intrare

- Prima linie: numărul întreg `N` (1 ≤ N ≤ 100)
- Următoarele `N` linii: câte un număr întreg (fiecare între -1000 și 1000)

### Rezultat

- Linia 1: `Pare: X` unde X este numărul de valori pare.
- Linia 2: `Impare: Y` unde Y este numărul de valori impare.

### Exemple

```
Intrare:
6
1
2
3
4
5
6
Ieșire:
Pare: 3
Impare: 3
```

```
Intrare:
4
2
4
6
8
Ieșire:
Pare: 4
Impare: 0
```

Zero se consideră par (0 % 2 == 0). Numerele negative se comportă la fel: -4 e par, -3 e impar.

Folosește **pipe()**, **fork()** și **wait(NULL)**.
