Implementează o **listă simplu înlănțuită** în C. Citește comenzi de la stdin și execută-le:

- `insereaza x` — inserează numărul întreg `x` la **finalul** listei
- `afiseaza` — afișează toate elementele separate prin spații pe o singură linie

Folosește `malloc` pentru a aloca fiecare nod. Fiecare nod are un câmp `int data` și un pointer `struct Nod *urmator`.

### Date de intrare

- Prima linie: un întreg `N` (numărul de comenzi)
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`insereaza` sau `afiseaza`)
  - Doar pentru `insereaza`, linia 2: numărul întreg `x`

### Rezultat

Pentru fiecare comandă `afiseaza`, afișează elementele listei separate prin spații. Dacă lista este goală, afișează `Goala`.

### Exemple

```
Intrare:
5
insereaza
10
insereaza
20
insereaza
30
afiseaza
insereaza
40
Ieșire:
10 20 30
```

```
Intrare:
3
afiseaza
insereaza
5
afiseaza
Ieșire:
Goala
5
```

```
Intrare:
2
insereaza
7
afiseaza
Ieșire:
7
```

O listă cu un singur nod afișează tot doar acea valoare, fără spațiu la final.
