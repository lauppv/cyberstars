Pe un hard disk vechi, datele stau pe cercuri numite **cilindri**, numerotați de la margine spre interior, iar deasupra lor se mișcă un braț cu un cap de citire. Mutarea brațului e lentă, mult mai lentă decât citirea. Când așteaptă multe cereri, ordinea în care le servește discul hotărăște cât drum face brațul, deci cât de repede merge totul. Alegerea acestei ordini e **planificarea discului**

Măsurăm un algoritm prin **mișcarea totală a capului**: suma distanțelor dintre un cilindru și următorul. **abs**, din stdlib.h, dă o distanță fără semn: abs(37 - 53) e 16

---

Exemplul clasic. Capul e la cilindrul 53, iar aceste cereri așteaptă, în ordinea în care au venit

```text
98 183 37 122 14 124 65 67
```

**FCFS** le servește în această ordine. Capul sare de la 53 la 98, apoi la 183, apoi înapoi la 37 și tot așa, înainte și înapoi peste tot discul. Total: 640 de cilindri

---

**SSTF**, „shortest seek time first”, adică întâi cea mai scurtă căutare, merge mereu la cererea cea mai apropiată. E aceeași idee ca SJF

```text
53 -> 65 -> 67 -> 37 -> 14 -> 98 -> 122 -> 124 -> 183
```

Total: 236. Mult mai bine. Dar, ca SJF, poate înfometa: cererile îndepărtate așteaptă cât timp tot vin unele mai apropiate

---

**LOOK** merge ca un lift. Brațul continuă într-o direcție, servind fiecare cerere de pe drum, până nu mai sunt cereri în acea direcție. Apoi se întoarce și le servește pe celelalte la întoarcere. Întâi în sus

```text
53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 37 -> 14
```

Total: 299. Puțin mai mult decât SSTF aici, dar nicio cerere nu așteaptă la nesfârșit: fiecare e atinsă cel târziu la următoarea trecere. **SCAN** e la fel, doar că brațul merge mereu până la ultimul cilindru înainte să se întoarcă

---

## Misiune: Brațul discului

Compară trei algoritmi de planificare a discului pe aceleași cereri

1. Citește cilindrul de pornire al capului, apoi numere de cilindri până se termină datele: cererile, în ordinea în care au venit
2. Pentru fiecare algoritm, afișează numele lui, ordinea în care servește cererile și mișcarea totală a capului, ca în exemplu
   - **FCFS**: în ordinea în care au venit
   - **SSTF**: mereu cea mai apropiată. Când două sunt la fel de aproape, întâi cilindrul mai mic
   - **LOOK**: întâi în sus, servind fiecare cerere de la cap în sus, în ordine crescătoare, apoi în jos, servind restul în ordine descrescătoare

Cilindrii sunt între 0 și 199. Sunt între 1 și 100 de cereri

**Exemplu**

Intrare

```text
53
98 183 37 122 14 124 65 67
```

Ieșire

```text
FCFS: 98 183 37 122 14 124 65 67, mutat 640
SSTF: 65 67 37 14 98 122 124 183, mutat 236
LOOK: 65 67 98 122 124 183 37 14, mutat 299
```
