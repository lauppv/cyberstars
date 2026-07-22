Calculează **Cel Mai Mare Divizor Comun (CMMDC)** și **Cel Mai Mic Multiplu Comun (CMMMC)** a două numere întregi pozitive folosind **algoritmul lui Euclid**.

Algoritmul lui Euclid găsește CMMDC-ul înlocuind în mod repetat numărul mai mare cu restul împărțirii lui la numărul mai mic, până când restul devine 0. Odată ce ai CMMDC-ul, CMMMC-ul poate fi calculat astfel: `CMMMC(A, B) = A * B / CMMDC(A, B)`.

### Date de intrare

- Linia 1: numărul întreg `A` (1 ≤ A ≤ 10000)
- Linia 2: numărul întreg `B` (1 ≤ B ≤ 10000)

### Rezultat

- Prima linie: `CMMDC: X` unde X este cel mai mare divizor comun.
- A doua linie: `CMMMC: Y` unde Y este cel mai mic multiplu comun.

### Exemple

```
Intrare:
12
8
Ieșire:
CMMDC: 4
CMMMC: 24
```

```
Intrare:
7
13
Ieșire:
CMMDC: 1
CMMMC: 91
```

```
Intrare:
9
9
Ieșire:
CMMDC: 9
CMMMC: 9
```

Când cele două numere sunt egale, CMMDC-ul și CMMMC-ul sunt amândouă chiar acel număr.
