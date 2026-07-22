Creează o clasă **Zar** care simulează aruncarea unui zar. Constructorul primește numărul de fețe și un **seed**. Adaugă o metodă `arunca()` care returnează următorul rezultat folosind `java.util.Random`.

**Important:** Creează obiectul `Random` cu `new Random(seed)` și folosește `nextInt(fete) + 1` astfel încât rezultatele să fie reproductibile pentru un anumit seed.

Citește numărul de fețe, seed-ul și numărul de aruncări de la stdin. Creează un obiect `Zar` și afișează rezultatul fiecărei aruncări pe o linie separată.

### Date de intrare

- Linia 1: numărul de fețe (număr întreg)
- Linia 2: seed (număr întreg)
- Linia 3: numărul de aruncări (număr întreg)

### Rezultat

- O linie pe aruncare, cu rezultatul (un număr întreg între 1 și fete).

### Exemple

```
Intrare:
6
42
1

Ieșire:
3
```

```
Intrare:
6
1
3

Ieșire:
4
5
2
```

```
Intrare:
20
7
1

Ieșire:
17
```

```
Intrare:
2
100
5

Ieșire:
2
2
1
2
2
```

Seed-uri diferite (și `fete` diferit) produc secvențe complet diferite — dar
același seed reproduce mereu aceeași secvență.
