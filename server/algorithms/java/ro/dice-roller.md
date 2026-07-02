# Ușor · Aruncător de zaruri

Creează o clasă **Dice** care simulează aruncarea unui zar. Constructorul primește numărul de fețe și un **seed**. Adaugă o metodă `roll()` care returnează următorul rezultat folosind `java.util.Random`.

**Important:** Creează obiectul `Random` cu `new Random(seed)` și folosește `nextInt(sides) + 1` astfel încât rezultatele să fie reproductibile pentru un anumit seed.

Citește numărul de fețe, seed-ul și numărul de aruncări de la stdin. Creează un obiect `Dice` și afișează rezultatul fiecărei aruncări pe o linie separată.

### Date de intrare

- Linia 1: trei numere întregi separate prin spații — sides, seed, numberOfRolls

### Rezultat

- O linie pe aruncare, cu rezultatul (un număr întreg între 1 și sides).

### Exemple

```
Intrare:
6 42 1

Ieșire:
3
```

```
Intrare:
6 1 3

Ieșire:
4
5
2
```

```
Intrare:
20 7 1

Ieșire:
17
```

```
Intrare:
2 100 5

Ieșire:
2
2
1
2
2
```

Seed-uri diferite (și `sides` diferit) produc secvențe complet diferite — dar
același seed reproduce mereu aceeași secvență.
