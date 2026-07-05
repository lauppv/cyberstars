# Mediu · Numărare cuvinte cu mutex

Două fire de execuție primesc câte o propoziție și numără cuvintele din ea. Firele adaugă rezultatul lor la un contor global partajat, protejat de un **mutex** — altfel, două scrieri concurente pot pierde incrementări.

Un cuvânt este orice secvență maximală de caractere care nu sunt spații. Fiecare fir numără local întâi, apoi ia lock-ul o singură dată la final ca să adauge contribuția lui la total — nu ținem mutexul mult timp.

### Date de intrare

- Linia 1: prima propoziție (până la 200 de caractere).
- Linia 2: a doua propoziție (până la 200 de caractere).

### Rezultat

- Un singur rând: `Total cuvinte: X` unde X este numărul total de cuvinte din ambele propoziții.

### Exemple

```
Intrare:
salut lume
codul e curat
Ieșire:
Total cuvinte: 5
```

```
Intrare:
unu doi trei patru
cinci sase
Ieșire:
Total cuvinte: 6
```

Folosește **pthread_create**, **pthread_join** și **pthread_mutex_lock/unlock** din `pthread.h`.
