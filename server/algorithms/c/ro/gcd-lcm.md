# Ușor · CMMDC și CMMMC

Calculează **Cel Mai Mare Divizor Comun (CMMDC)** și **Cel Mai Mic Multiplu Comun (CMMMC)** a două numere întregi pozitive folosind **algoritmul lui Euclid**.

Algoritmul lui Euclid găsește CMMDC-ul înlocuind în mod repetat numărul mai mare cu restul împărțirii lui la numărul mai mic, până când restul devine 0. Odată ce ai CMMDC-ul, CMMMC-ul poate fi calculat astfel: `CMMMC(A, B) = A * B / CMMDC(A, B)`.

### Date de intrare

- O linie care conține două numere întregi `A` și `B` (1 ≤ A, B ≤ 100000), separate printr-un spațiu.

### Rezultat

- Prima linie: `GCD: X` unde X este cel mai mare divizor comun.
- A doua linie: `LCM: Y` unde Y este cel mai mic multiplu comun.

### Exemple

```
Intrare:
12 8
Ieșire:
GCD: 4
LCM: 24
```

```
Intrare:
7 13
Ieșire:
GCD: 1
LCM: 91
```

```
Intrare:
9 9
Ieșire:
GCD: 9
LCM: 9
```

Când cele două numere sunt egale, CMMDC-ul și CMMMC-ul sunt amândouă chiar acel număr.

### Indicii

- Implementează algoritmul lui Euclid: cât timp `b != 0`, setează `temp = b`, `b = a % b`, `a = temp`. CMMDC-ul este `a`.
- Calculează CMMMC-ul folosind formula `A * B / CMMDC` — împarte înainte de a înmulți pentru a evita depășirea: `A / CMMDC * B`.
- Salvează valorile originale ale lui A și B înainte de a rula bucla CMMDC, deoarece bucla le modifică.
