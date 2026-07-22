Implementează o structură de date de tip **stivă** folosind un tablou. Citește o secvență de comenzi și procesează-le:

- **pune X** — adaugă numărul întreg X în vârful stivei
- **scoate** — elimină și afișează elementul din vârf, sau afișează `Goala` dacă stiva este goală
- **varf** — afișează elementul din vârf fără a-l elimina, sau afișează `Goala` dacă stiva este goală

### Date de intrare

- Prima linie: un întreg `M` (1 ≤ M ≤ 100), numărul de comenzi
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`pune`, `scoate` sau `varf`)
  - Doar pentru `pune`, linia 2: numărul întreg X

### Rezultat

Pentru fiecare comandă `scoate` sau `varf`, afișează o linie: valoarea sau `Goala`.

### Exemple

```
Intrare:
5
pune
10
pune
20
varf
scoate
scoate
Ieșire:
20
20
10
```

```
Intrare:
3
scoate
pune
5
varf
Ieșire:
Goala
5
```

```
Intrare:
5
pune
1
pune
2
scoate
scoate
scoate
Ieșire:
2
1
Goala
```

Odată ce stiva e complet golită, apelurile `scoate` următoare afișează în continuare `Goala`.
