Pune laolaltă lecțiile despre arbori: un **arbore binar de căutare** construit prin inserare, citit **pe niveluri** cu o coadă și parcurs **în adâncime** cu recursivitate

---

O scurtă amintire a pieselor

- **Inserarea** într-un arbore binar de căutare: valorile mai mici merg la stânga, cele mai mari la dreapta, iar nodul nou merge unde se termină drumul
- **Pe niveluri**: o coadă făcută dintr-un array de `struct Nod *` cu un indice **inceput** și unul **sfarsit**. Scoate un nod din față, pune-i copiii în spate și numără **sfarsit - inceput** la începutul fiecărui nivel
- **În adâncime**: o funcție recursivă care nu face nimic pe **NULL** și se apelează pe cei doi copii
- O **frunză** nu are copii; citite într-o parcurgere în adâncime, frunzele ies de la stânga la dreapta
- **Căutarea** într-un arbore binar de căutare urmează un singur drum de la rădăcină, la stânga sau la dreapta la fiecare nod
- **Eliberarea** unui arbore întreg este o parcurgere în postordine: întâi copiii, apoi nodul

---

## Misiune: Hartă pentru un arbore de căutare

1. Scrie structura **Nod**, cu o valoare, un copil stâng și un copil drept
2. Citește intrarea cu **scanf**: pe prima linie **n**, câte valori sunt, pe a doua linie cele **n** valori, iar pe a treia linie o valoare **căutată**, una dintre ele
3. Pornind de la un arbore gol, inserează valorile într-un arbore binar de căutare una câte una, în ordinea în care au fost citite
4. Afișează arborele nivel cu nivel, folosind o coadă: câte o linie pentru fiecare nivel, cu **Nivelul**, numărul nivelului, două puncte și valorile nivelului de la stânga la dreapta
5. Afișează **Frunze:** și frunzele de la stânga la dreapta, găsite cu o parcurgere recursivă
6. Afișează **Drum pana la**, valoarea căutată, două puncte și valorile de pe drumul de la rădăcină până jos la valoarea căutată, inclusiv rădăcina și valoarea căutată
7. Eliberează fiecare nod înainte ca **main** să se termine

**n** este de la 1 la 7, valorile sunt toate diferite, fiecare de la -1000 la 1000, iar valoarea căutată e mereu una dintre ele

**Exemplu**

Intrare

```text
6
50 30 70 20 40 80
40
```

Ieșire

```text
Nivelul 0: 50
Nivelul 1: 30 70
Nivelul 2: 20 40 80
Frunze: 20 40 80
Drum pana la 40: 50 30 40
```

**Exemplu**

Intrare

```text
5
30 10 40 20 35
20
```

Ieșire

```text
Nivelul 0: 30
Nivelul 1: 10 40
Nivelul 2: 20 35
Frunze: 20 35
Drum pana la 20: 30 10 20
```

**Exemplu**

Intrare

```text
1
7
7
```

Ieșire

```text
Nivelul 0: 7
Frunze: 7
Drum pana la 7: 7
```
