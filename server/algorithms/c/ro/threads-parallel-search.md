Împarte un vector în două și caută valoarea `tinta` cu două fire în paralel. Firele scriu într-o variabilă globală `index_gasit` protejată de un **mutex**: fiecare fir, când găsește o potrivire, actualizează valoarea doar dacă noul index e mai mic decât cel deja înregistrat.

La final, firul principal afișează cel mai mic index unde apare `tinta`, sau `Nu apare` dacă valoarea nu se găsește nicăieri.

### Date de intrare

- Prima linie: numărul întreg `N` (2 ≤ N ≤ 100)
- Următoarele `N` linii: câte un număr întreg (fiecare între -1000 și 1000)
- Ultima linie: numărul întreg `tinta`

### Rezultat

- Un singur rând: `Gasit la indexul K` unde K e cel mai mic index (indexare de la 0) la care apare `tinta`, sau `Nu apare` dacă nu apare deloc.

### Exemple

```
Intrare:
6
10
20
30
40
50
60
30
Ieșire:
Gasit la indexul 2
```

```
Intrare:
5
1
2
3
4
5
7
Ieșire:
Nu apare
```

```
Intrare:
6
7
3
7
8
7
9
7
Ieșire:
Gasit la indexul 0
```

Chiar dacă `tinta` apare de mai multe ori, afișăm întotdeauna cel mai mic index — de aceea comparăm `i < index_gasit` sub mutex.

Folosește **pthread_create**, **pthread_join** și un **pthread_mutex_t** partajat.
