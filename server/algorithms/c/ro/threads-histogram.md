Două fire de execuție numără aparițiile literelor lowercase într-un șir, partajând un array de 26 de contoare (histograma). Fiecare incrementare din histogramă e protejată de un **mutex** pentru că cele două fire pot atinge același contor în același moment.

Firul t1 procesează prima jumătate a șirului, t2 procesează a doua. Firul principal așteaptă amândouă terminările și afișează literele care au apărut cel puțin o dată, în ordine alfabetică.

### Date de intrare

- Linia 1: un șir de cel mult 200 de caractere, format doar din litere lowercase (fără spații).

### Rezultat

- Câte o linie pentru fiecare literă care apare în șir, în ordine alfabetică, sub forma `x: k` (litera și frecvența ei).

### Exemple

```
Intrare:
programare
Ieșire:
a: 2
e: 1
g: 1
m: 1
o: 1
p: 1
r: 3
```

```
Intrare:
aabbcc
Ieșire:
a: 2
b: 2
c: 2
```

Folosește **pthread_create**, **pthread_join** și un **pthread_mutex_t** partajat.
