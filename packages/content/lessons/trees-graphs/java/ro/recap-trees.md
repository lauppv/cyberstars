Pune la un loc lecțiile despre arbori: un **arbore binar de căutare** construit prin inserări, citit **pe niveluri** cu o coadă și parcurs **în adâncime** cu recursivitate

---

O scurtă amintire a pieselor

- **Inserarea** într-un arbore binar de căutare: valorile mai mici merg la stânga, cele mai mari la dreapta, iar nodul nou se pune acolo unde se termină drumul
- **Pe niveluri**: un `Queue<Nod>` făcut cu **new ArrayDeque<>()**. Scoate un nod din față cu **poll**, pune-i copiii la sfârșit cu **add** și citește **size()** la începutul fiecărui nivel
- **În adâncime**: o metodă recursivă care nu face nimic pe **null** și se apelează pe cei doi copii
- O **frunză** nu are copii; citite într-o parcurgere în adâncime, frunzele ies de la stânga la dreapta
- **Căutarea** într-un arbore binar de căutare urmează un singur drum de la rădăcină, la stânga sau la dreapta la fiecare nod

---

## Misiune: Desenează un arbore de căutare

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu două variabile: **valori**, un tablou de `int`, și **cautat**, unul dintre acele numere. De exemplu `int[] valori = {50, 30, 70, 20, 40, 80};` și `int cautat = 40;`
3. Pornind de la un arbore gol, inserează valorile într-un arbore binar de căutare una câte una, în ordinea din tablou
4. Afișează arborele nivel cu nivel, folosind o coadă și metoda ei **poll**: câte o linie pe nivel, cu **Nivelul**, numărul nivelului, două puncte și valorile nivelului de la stânga la dreapta
5. Afișează **Frunze:** și frunzele de la stânga la dreapta, găsite cu o parcurgere recursivă
6. Afișează **Drum pana la**, valoarea căutată, două puncte și valorile de pe drumul de la rădăcină până la ea, cu tot cu rădăcina și cu valoarea căutată

**valori** are între 1 și 7 numere, toate diferite, fiecare de la -1000 la 1000, iar **cautat** este mereu unul dintre ele

**Exemplu** pentru valori = {50, 30, 70, 20, 40, 80} și cautat = 40

```text
Nivelul 0: 50
Nivelul 1: 30 70
Nivelul 2: 20 40 80
Frunze: 20 40 80
Drum pana la 40: 50 30 40
```

**Exemplu** pentru valori = {30, 10, 40, 20, 35} și cautat = 20

```text
Nivelul 0: 30
Nivelul 1: 10 40
Nivelul 2: 20 35
Frunze: 20 35
Drum pana la 20: 30 10 20
```

**Exemplu** pentru valori = {7} și cautat = 7

```text
Nivelul 0: 7
Frunze: 7
Drum pana la 7: 7
```
