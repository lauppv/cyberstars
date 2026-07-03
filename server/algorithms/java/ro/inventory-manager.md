# Mediu · Gestionar de inventar

Folosește un **HashMap** pentru a gestiona un inventar de articole și cantitățile lor. Procesează comenzi pentru a adăuga articole, a elimina articole și a verifica stocul.

### Date de intrare

- Linia 1: numărul de comenzi N
- Următoarele N linii: una dintre:
  - `add item qty` — adaugă qty unități de item (sau crește dacă există)
  - `remove item qty` — elimină qty unități (dacă nu sunt suficiente, afișează `Insuficient ITEM`)
  - `check item` — afișează `ITEM: QTY` (sau `ITEM: 0` dacă nu se află în inventar)

### Rezultat

- Pentru fiecare comandă `check`: afișează `ITEM: QTY`
- Pentru fiecare `remove` eșuat: afișează `Insuficient ITEM`
- Ultima linie: `Articole: N` (numărul total de articole distincte cu qty > 0)

### Exemple

```
Intrare:
5
add mar 10
add banana 5
remove mar 3
check mar
check portocala

Ieșire:
mar: 7
portocala: 0
Articole: 2
```

```
Intrare:
3
add lapte 2
remove lapte 5
check lapte

Ieșire:
Insuficient lapte
lapte: 2
Articole: 1
```

```
Intrare:
4
add mar 3
remove mar 3
check mar
check mar

Ieșire:
mar: 0
mar: 0
Articole: 0
```

Eliminarea exact a întregului stoc al unui articol îl aduce la 0 — rămâne
cunoscut, dar nu mai contează pentru `Articole: N`.
