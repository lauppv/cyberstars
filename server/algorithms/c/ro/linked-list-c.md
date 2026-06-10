# Dificil · Listă înlănțuită

Implementează o **listă simplu înlănțuită** în C. Citește comenzi de la stdin și execută-le:

- `INSERT x` — inserează numărul întreg `x` la **finalul** listei
- `PRINT` — afișează toate elementele separate prin spații pe o singură linie

Folosește `malloc` pentru a aloca fiecare nod. Fiecare nod are un câmp `int data` și un pointer `struct Node *next`.

### Date de intrare

- Prima linie: un întreg `N` (numărul de comenzi)
- Următoarele `N` linii: o comandă (`INSERT x` sau `PRINT`)

### Rezultat

Pentru fiecare comandă `PRINT`, afișează elementele listei separate prin spații. Dacă lista este goală, afișează `EMPTY`.

### Exemple

```
Intrare:
5
INSERT 10
INSERT 20
INSERT 30
PRINT
INSERT 40
Ieșire:
10 20 30
```

```
Intrare:
3
PRINT
INSERT 5
PRINT
Ieșire:
EMPTY
5
```

### Indicii

- Definește o structură: `struct Node { int data; struct Node *next; };`
- Menține un pointer `head`, inițial `NULL`.
- Pentru INSERT, alocă un nod nou cu `malloc`, parcurge până la final și leagă-l.
- Pentru PRINT, parcurge de la `head` și afișează datele fiecărui nod.
