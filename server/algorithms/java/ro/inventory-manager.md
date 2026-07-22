Folosește un **HashMap** pentru a gestiona un inventar de articole și cantitățile lor. Procesează comenzi pentru a adăuga articole, a elimina articole și a verifica stocul.

### Date de intrare

- Linia 1: numărul de comenzi N
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`adauga`, `elimina` sau `verifica`)
  - Linia 2: numele articolului
  - Doar pentru `adauga` și `elimina`, linia 3: cantitatea (număr întreg)

### Rezultat

- Pentru fiecare comandă `verifica`: afișează `ARTICOL: QTY`
- Pentru fiecare `elimina` eșuat: afișează `Insuficient ARTICOL`
- Ultima linie: `Articole: N` (numărul total de articole distincte cu qty > 0)

### Exemple

```
Intrare:
5
adauga
mar
10
adauga
banana
5
elimina
mar
3
verifica
mar
verifica
portocala

Ieșire:
mar: 7
portocala: 0
Articole: 2
```

```
Intrare:
3
adauga
lapte
2
elimina
lapte
5
verifica
lapte

Ieșire:
Insuficient lapte
lapte: 2
Articole: 1
```

```
Intrare:
4
adauga
mar
3
elimina
mar
3
verifica
mar
verifica
mar

Ieșire:
mar: 0
mar: 0
Articole: 0
```

Eliminarea exact a întregului stoc al unui articol îl aduce la 0 — rămâne
cunoscut, dar nu mai contează pentru `Articole: N`.
