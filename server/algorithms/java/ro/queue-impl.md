# Mediu · Implementarea unei cozi

Implementează o clasă **Queue** folosind un `ArrayList` ca stocare internă. Coada trebuie să suporte operațiile `enqueue`, `dequeue` și `peek`, urmând principiul FIFO (First In, First Out — primul intrat, primul ieșit).

Procesează comenzile de la stdin și afișează rezultatele pentru `dequeue` și `peek`. Dacă `dequeue` sau `peek` este apelat pe o coadă goală, afișează `Empty`.

### Date de intrare

- Linia 1: numărul de comenzi N
- Următoarele N linii: una dintre:
  - `enqueue X` — adaugă numărul întreg X la spatele cozii
  - `dequeue` — elimină și afișează elementul din față
  - `peek` — afișează elementul din față fără a-l elimina

### Rezultat

- Pentru fiecare `dequeue`: valoarea eliminată, sau `Empty`
- Pentru fiecare `peek`: valoarea din față, sau `Empty`

### Exemple

```
Intrare:
6
enqueue 10
enqueue 20
peek
dequeue
dequeue
dequeue

Ieșire:
10
10
20
Empty
```

```
Intrare:
4
enqueue 5
enqueue 15
dequeue
peek

Ieșire:
5
15
```

```
Intrare:
2
dequeue
peek

Ieșire:
Empty
Empty
```

Atât `dequeue`, cât și `peek` trebuie să afișeze `Empty` când coada nu conține nimic.
