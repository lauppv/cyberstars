# Mediu · Gestionar de inventar

Folosește un **HashMap** pentru a gestiona un inventar de articole și cantitățile lor. Procesează comenzi pentru a adăuga articole, a elimina articole și a verifica stocul.

### Date de intrare

- Linia 1: numărul de comenzi N
- Următoarele N linii: una dintre:
  - `add item qty` — adaugă qty unități de item (sau crește dacă există)
  - `remove item qty` — elimină qty unități (dacă nu sunt suficiente, afișează `Not enough ITEM`)
  - `check item` — afișează `ITEM: QTY` (sau `ITEM: 0` dacă nu se află în inventar)

### Rezultat

- Pentru fiecare comandă `check`: afișează `ITEM: QTY`
- Pentru fiecare `remove` eșuat: afișează `Not enough ITEM`
- Ultima linie: `Items: N` (numărul total de articole distincte cu qty > 0)

### Exemple

```
Intrare:
5
add apple 10
add banana 5
remove apple 3
check apple
check orange

Ieșire:
apple: 7
orange: 0
Items: 2
```

```
Intrare:
3
add milk 2
remove milk 5
check milk

Ieșire:
Not enough milk
milk: 2
Items: 1
```

### Indicii

- Folosește `HashMap<String, Integer>` pentru a stoca inventarul.
- `getOrDefault(item, 0)` este util pentru articolele care nu sunt încă în map.
- Când elimini, verifică mai întâi cantitatea înainte de a scădea.
- Numără doar articolele cu cantitatea > 0 pentru linia finală `Items: N`.
