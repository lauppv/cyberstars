Implementează o **listă simplu înlănțuită** de la zero. Creează o clasă `Nod` cu câmpurile `valoare` și `urmator`, și o clasă `ListaInlantuita` cu operațiile `adauga`, `elimina` și `afiseaza`.

Procesează comenzile de la stdin.

### Date de intrare

- Linia 1: numărul de comenzi N
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`adauga`, `elimina` sau `afiseaza`)
  - Doar pentru `adauga` și `elimina`, linia 2: numărul întreg X

Comportament:

- `adauga X` — adaugă numărul întreg X la sfârșitul listei
- `elimina X` — elimină prima apariție a lui X (afișează `Negasit` dacă X nu se află în listă)
- `afiseaza` — afișează toate elementele separate prin `->`, sau `Goala` dacă lista este goală

### Rezultat

- Pentru fiecare `afiseaza`: elementele în ordine separate prin `->`, sau `Goala`
- Pentru fiecare `elimina` eșuat: `Negasit`

### Exemple

```
Intrare:
6
adauga
10
adauga
20
adauga
30
afiseaza
elimina
20
afiseaza

Ieșire:
10 -> 20 -> 30
10 -> 30
```

```
Intrare:
4
adauga
5
elimina
5
elimina
5
afiseaza

Ieșire:
Negasit
Goala
```

```
Intrare:
5
adauga
1
adauga
2
adauga
3
elimina
1
afiseaza

Ieșire:
2 -> 3
```

Eliminarea nodului **cap** înseamnă că referința `cap` a listei trebuie
mutată chiar ea către al doilea nod — nu există un nod „anterior” de relegat.
