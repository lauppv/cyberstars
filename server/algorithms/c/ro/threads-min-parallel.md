Împarte un vector în două și caută minimul în paralel: firul t1 lucrează pe prima jumătate, firul t2 pe a doua. Fiecare fir primește **un pointer** către un slot unde își scrie rezultatul, iar firul principal compară cele două minime la final.

Firele primesc un singur argument `void *`, așa că împachetăm începutul, sfârșitul, vectorul și slot-ul de rezultat într-o structură. Fiecare fir scrie într-un slot separat, deci nu avem nevoie de mutex.

### Date de intrare

- Prima linie: numărul întreg `N` (2 ≤ N ≤ 100)
- Următoarele `N` linii: câte un număr întreg (fiecare între -1000 și 1000)

### Rezultat

- Un singur rând: `Minim: X` unde X este cea mai mică valoare din vector.

### Exemple

```
Intrare:
6
5
3
8
1
7
4
Ieșire:
Minim: 1
```

```
Intrare:
4
-2
-7
-5
-1
Ieșire:
Minim: -7
```

Folosește **pthread_create** și **pthread_join** din `pthread.h`.
