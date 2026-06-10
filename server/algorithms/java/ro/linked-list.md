# Dificil · Listă înlănțuită

Implementează o **listă simplu înlănțuită** de la zero. Creează o clasă `Node` cu câmpurile `value` și `next`, și o clasă `LinkedList` cu operațiile `add`, `remove` și `print`.

Procesează comenzile de la stdin.

### Date de intrare

- Linia 1: numărul de comenzi N
- Următoarele N linii: una dintre:
  - `add X` — adaugă numărul întreg X la sfârșitul listei
  - `remove X` — elimină prima apariție a lui X (afișează `Not found` dacă X nu se află în listă)
  - `print` — afișează toate elementele separate prin `->`, sau `Empty` dacă lista este goală

### Rezultat

- Pentru fiecare `print`: elementele în ordine separate prin `->`, sau `Empty`
- Pentru fiecare `remove` eșuat: `Not found`

### Exemple

```
Intrare:
6
add 10
add 20
add 30
print
remove 20
print

Ieșire:
10 -> 20 -> 30
10 -> 30
```

```
Intrare:
4
add 5
remove 5
remove 5
print

Ieșire:
Not found
Empty
```

### Indicii

- `Node` conține o valoare și o referință către nodul următor.
- `LinkedList` conține o referință către nodul `head`.
- Pentru `add`: parcurge până la sfârșit, setează `next` al ultimului nod.
- Pentru `remove`: găsește nodul, leagă nodul anterior la `node.next`.
- Caz special: eliminarea nodului head.
