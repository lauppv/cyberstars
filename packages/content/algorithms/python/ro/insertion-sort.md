Citește o listă de numere și sortează-le folosind algoritmul **insertion sort** (sortare prin inserție). Insertion sort funcționează construind o porțiune sortată a listei câte un element pe rând: alege următorul element nesortat și inserează-l în poziția corectă în porțiunea sortată.

### Date de intrare

- Linia 1: un număr întreg `n`, câte numere sunt (1 <= n <= 3000).
- Linia 2: `n` numere întregi separate prin spații, fiecare între -10^9 și 10^9.

### Rezultat

Numerele sortate, separate prin spații.

### Exemple

```
Intrare:
5
5 3 8 1 2

Ieșire:
1 2 3 5 8
```

```visual
{
  "type": "array",
  "values": [5, 3, 8, 1, 2],
  "caption": "Începutul listei este sortat; la început e doar 5. La fiecare pas luăm următorul număr și îl mutăm la stânga peste fiecare număr mai mare, până când cel din stânga lui e mai mic sau nu mai e nimic. Numerele încă nepreluate sunt estompate.",
  "steps": [
    {"title": "Pasul 1", "range": [0, 1], "caption": "Luăm 3. În fața lui, 5 e sortat singur"},
    {"compare": [0, 1], "ask": "Este 5 > 3?", "swap": true, "caption": "Da, deci 5 se mută la dreapta și 3 la stânga → [3, 5, 8, 1, 2]. În stânga lui 3 nu mai e nimic"},
    {"title": "Pasul 2", "range": [0, 2], "caption": "Luăm 8. În fața lui, [3, 5] e sortat"},
    {"compare": [1, 2], "ask": "Este 5 > 8?", "caption": "Nu, deci 8 rămâne pe loc. [3, 5, 8] e sortat"},
    {"title": "Pasul 3", "range": [0, 3], "caption": "Luăm 1"},
    {"compare": [2, 3], "ask": "Este 8 > 1?", "swap": true, "caption": "Da, deci 8 se mută la dreapta și 1 la stânga → [3, 5, 1, 8, 2]"},
    {"compare": [1, 2], "ask": "Este 5 > 1?", "swap": true, "caption": "Da, deci 5 se mută la dreapta și 1 la stânga → [3, 1, 5, 8, 2]"},
    {"compare": [0, 1], "ask": "Este 3 > 1?", "swap": true, "caption": "Da, deci 3 se mută la dreapta și 1 la stânga → [1, 3, 5, 8, 2]. În stânga lui 1 nu mai e nimic"},
    {"title": "Pasul 4", "range": [0, 4], "caption": "Luăm 2, ultimul număr"},
    {"compare": [3, 4], "ask": "Este 8 > 2?", "swap": true, "caption": "Da, deci 8 se mută la dreapta și 2 la stânga → [1, 3, 5, 2, 8]"},
    {"compare": [2, 3], "ask": "Este 5 > 2?", "swap": true, "caption": "Da, deci 5 se mută la dreapta și 2 la stânga → [1, 3, 2, 5, 8]"},
    {"compare": [1, 2], "ask": "Este 3 > 2?", "swap": true, "caption": "Da, deci 3 se mută la dreapta și 2 la stânga → [1, 2, 3, 5, 8]"},
    {"compare": [0, 1], "ask": "Este 1 > 2?", "caption": "Nu, deci 2 rămâne pe loc"},
    {"done": [0, 1, 2, 3, 4], "caption": "Am luat toate numerele și lista e sortată: 1 2 3 5 8"}
  ]
}
```

```
Intrare:
4
4 3 2 1

Ieșire:
1 2 3 4
```

```
Intrare:
1
9

Ieșire:
9
```

O listă cu un singur element este deja sortată.

```
Intrare:
4
3 1 3 1

Ieșire:
1 1 3 3
```

Valorile duplicate sunt păstrate: sortarea trebuie doar să plaseze valorile
egale una lângă alta.
