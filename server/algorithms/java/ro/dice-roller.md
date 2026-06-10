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
1
```

### Indicii

- `new Random(seed)` creează un generator de numere aleatoare reproductibil.
- `random.nextInt(sides)` returnează o valoare de la 0 la sides-1, deci adaugă 1.
- Încapsulează obiectul `Random` ca un câmp privat în clasa ta `Dice`.
- Folosirea unui seed înseamnă că aceleași intrări produc întotdeauna aceleași ieșiri — excelent pentru testare!
