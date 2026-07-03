# Dificil · Listă înlănțuită

Implementează o **listă simplu înlănțuită** de la zero. Creează o clasă `Nod` cu câmpurile `valoare` și `urmator`, și o clasă `ListaInlantuita` cu operațiile `add`, `remove` și `print`.

Procesează comenzile de la stdin.

### Date de intrare

- Linia 1: numărul de comenzi N
- Următoarele N linii: una dintre:
  - `add X` — adaugă numărul întreg X la sfârșitul listei
  - `remove X` — elimină prima apariție a lui X (afișează `Negasit` dacă X nu se află în listă)
  - `print` — afișează toate elementele separate prin `->`, sau `Goala` dacă lista este goală

### Rezultat

- Pentru fiecare `print`: elementele în ordine separate prin `->`, sau `Goala`
- Pentru fiecare `remove` eșuat: `Negasit`

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
Negasit
Goala
```

```
Intrare:
5
add 1
add 2
add 3
remove 1
print

Ieșire:
2 -> 3
```

Eliminarea nodului **cap** înseamnă că referința `cap` a listei trebuie
mutată chiar ea către al doilea nod — nu există un nod „anterior” de relegat.
