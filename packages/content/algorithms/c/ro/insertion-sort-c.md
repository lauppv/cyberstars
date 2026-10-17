Citește un întreg **N**, apoi citește **N** numere întregi. Sortează-le folosind algoritmul de **sortare prin inserție** și afișează rezultatul sortat.

Sortarea prin inserție funcționează construind o porțiune sortată a tabloului câte un element pe rând. Pentru fiecare element nou, deplasează elementele mai mari spre dreapta și inserează-l în poziția sa corectă. Se execută în timp O(N²), dar este eficientă pentru tablouri mici sau aproape sortate.

### Date de intrare

- Prima linie: un întreg `N` (1 <= N <= 3·10^4)
- Următoarele `N` linii: câte un număr întreg (-10^9 <= x <= 10^9)

### Rezultat

Cele `N` numere întregi sortate crescător, separate prin spații, pe o singură linie.

### Exemple

```
Intrare:
5
12
11
13
5
6
Ieșire: 5 6 11 12 13
```

```visual
{
  "type": "array",
  "values": [12, 11, 13, 5, 6],
  "caption": "Începutul tabloului este sortat; la început e doar 12. La fiecare pas luăm următorul număr și deplasăm cu o poziție la dreapta fiecare număr mai mare din fața lui, până când cel din stânga lui e mai mic sau nu mai e nimic. Numerele încă nepreluate sunt estompate.",
  "steps": [
    {"title": "Pasul 1", "range": [0, 1], "caption": "Luăm 11. În fața lui, 12 e sortat singur"},
    {"compare": [0, 1], "ask": "Este 12 > 11?", "swap": true, "caption": "Da, deci 12 se deplasează la dreapta și 11 la stânga → [11, 12, 13, 5, 6]. În stânga lui 11 nu mai e nimic"},
    {"title": "Pasul 2", "range": [0, 2], "caption": "Luăm 13. În fața lui, [11, 12] e sortat"},
    {"compare": [1, 2], "ask": "Este 12 > 13?", "caption": "Nu, deci 13 rămâne pe loc. [11, 12, 13] e sortat"},
    {"title": "Pasul 3", "range": [0, 3], "caption": "Luăm 5"},
    {"compare": [2, 3], "ask": "Este 13 > 5?", "swap": true, "caption": "Da, deci 13 se deplasează la dreapta și 5 la stânga → [11, 12, 5, 13, 6]"},
    {"compare": [1, 2], "ask": "Este 12 > 5?", "swap": true, "caption": "Da, deci 12 se deplasează la dreapta și 5 la stânga → [11, 5, 12, 13, 6]"},
    {"compare": [0, 1], "ask": "Este 11 > 5?", "swap": true, "caption": "Da, deci 11 se deplasează la dreapta și 5 la stânga → [5, 11, 12, 13, 6]. În stânga lui 5 nu mai e nimic"},
    {"title": "Pasul 4", "range": [0, 4], "caption": "Luăm 6, ultimul număr"},
    {"compare": [3, 4], "ask": "Este 13 > 6?", "swap": true, "caption": "Da, deci 13 se deplasează la dreapta și 6 la stânga → [5, 11, 12, 6, 13]"},
    {"compare": [2, 3], "ask": "Este 12 > 6?", "swap": true, "caption": "Da, deci 12 se deplasează la dreapta și 6 la stânga → [5, 11, 6, 12, 13]"},
    {"compare": [1, 2], "ask": "Este 11 > 6?", "swap": true, "caption": "Da, deci 11 se deplasează la dreapta și 6 la stânga → [5, 6, 11, 12, 13]"},
    {"compare": [0, 1], "ask": "Este 5 > 6?", "caption": "Nu, deci 6 rămâne pe loc"},
    {"done": [0, 1, 2, 3, 4], "caption": "Am luat toate numerele și tabloul e sortat: 5 6 11 12 13"}
  ]
}
```

```
Intrare:
4
4
3
2
1
Ieșire: 1 2 3 4
```

```
Intrare:
1
9
Ieșire: 9
```

```
Intrare:
4
1
1
2
2
Ieșire: 1 1 2 2
```

Un tablou deja sortat (cu duplicate) nu necesită nicio deplasare.
