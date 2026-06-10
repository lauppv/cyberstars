# Mediu · Implementarea unei stive

Implementează o clasă **Stack** folosind un `ArrayList` ca stocare internă. Stiva trebuie să suporte operațiile `push`, `pop` și `peek`.

Procesează comenzile de la stdin și afișează rezultatele pentru `pop` și `peek`. Dacă `pop` sau `peek` este apelat pe o stivă goală, afișează `Empty`.

### Date de intrare

- Linia 1: numărul de comenzi N
- Următoarele N linii: una dintre:
  - `push X` — pune numărul întreg X pe stivă
  - `pop` — elimină și afișează elementul din vârf
  - `peek` — afișează elementul din vârf fără a-l elimina

### Rezultat

- Pentru fiecare `pop`: valoarea eliminată, sau `Empty`
- Pentru fiecare `peek`: valoarea din vârf, sau `Empty`

### Exemple

```
Intrare:
6
push 10
push 20
peek
pop
pop
pop

Ieșire:
20
20
10
Empty
```

```
Intrare:
3
push 5
push 15
peek

Ieșire:
15
```

### Indicii

- Folosește `ArrayList<Integer>` pentru a stoca elementele.
- Push adaugă la sfârșitul listei, pop elimină de la sfârșit.
- `list.get(list.size() - 1)` îți dă elementul din vârf.
- `list.remove(list.size() - 1)` elimină și returnează elementul din vârf.
- Verifică întotdeauna `isEmpty()` înainte de pop/peek.
