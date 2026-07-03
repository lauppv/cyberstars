# Mediu · Stivă folosind un tablou

Implementează o structură de date de tip **stivă** folosind un tablou. Citește o secvență de comenzi și procesează-le:

- **push X** — adaugă numărul întreg X în vârful stivei
- **pop** — elimină și afișează elementul din vârf, sau afișează `Goala` dacă stiva este goală
- **peek** — afișează elementul din vârf fără a-l elimina, sau afișează `Goala` dacă stiva este goală

### Date de intrare

- Prima linie: un întreg `M` (1 ≤ M ≤ 100), numărul de comenzi
- Următoarele `M` linii: o comandă pe linie (`push X`, `pop` sau `peek`)

### Rezultat

Pentru fiecare comandă `pop` sau `peek`, afișează o linie: valoarea sau `Goala`.

### Exemple

```
Intrare:
5
push 10
push 20
peek
pop
pop
Ieșire:
20
20
10
```

```
Intrare:
3
pop
push 5
peek
Ieșire:
Goala
5
```

```
Intrare:
5
push 1
push 2
pop
pop
pop
Ieșire:
2
1
Goala
```

Odată ce stiva e complet golită, apelurile `pop` următoare afișează în continuare `Goala`.
