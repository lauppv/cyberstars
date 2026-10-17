Implementează algoritmul **bubble sort**. Citește un tablou de numere întregi și sortează-le în ordine crescătoare folosind bubble sort, apoi afișează tabloul sortat.

Bubble sort funcționează parcurgând repetat lista, comparând elementele adiacente și interschimbându-le dacă sunt în ordine greșită. Parcurgerea listei se repetă până când lista este sortată.

### Date de intrare

- Linia 1: numărul întreg N, numărul de elemente (1 <= N <= 10^4)
- Următoarele N linii: câte un număr întreg (orice valoare de tip `int`)

### Rezultat

- Numerele întregi sortate pe o singură linie, separate prin spații.

### Exemple

```
Intrare:
5
5
3
8
1
2

Ieșire:
1 2 3 5 8
```

```visual
{
  "type": "array",
  "values": [5, 3, 8, 1, 2],
  "caption": "Pornim de la poziția 0 (j = 0) și comparăm numărul de acolo cu vecinul din dreapta (j + 1). Dacă cel din stânga e mai mare, își schimbă locurile. Apoi j se mută un pas la dreapta. Fiecare trecere duce cel mai mare număr la capăt.",
  "pointers": ["j = {i}", "j + 1"],
  "steps": [
    {"title": "Trecerea 1", "compare": [0, 1], "ask": "Este 5 > 3?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"compare": [1, 2], "ask": "Este 5 > 8?", "caption": "Nu, deci rămân pe loc"},
    {"compare": [2, 3], "ask": "Este 8 > 1?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"compare": [3, 4], "ask": "Este 8 > 2?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"sorted": 4, "caption": "8 a ajuns la capăt, la locul lui"},
    {"title": "Trecerea 2", "compare": [0, 1], "ask": "Este 3 > 5?", "caption": "Nu, deci rămân pe loc"},
    {"compare": [1, 2], "ask": "Este 5 > 1?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"compare": [2, 3], "ask": "Este 5 > 2?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"sorted": 3, "caption": "Și 5 e la locul lui"},
    {"title": "Trecerea 3", "compare": [0, 1], "ask": "Este 3 > 1?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"compare": [1, 2], "ask": "Este 3 > 2?", "swap": true, "caption": "Da, deci își schimbă locurile"},
    {"sorted": 0, "caption": "Gata! Tabloul este sortat"}
  ]
}
```

```
Intrare:
3
3
2
1

Ieșire:
1 2 3
```

```
Intrare:
1
7

Ieșire:
7
```

Un tablou cu un singur element este deja sortat, nu e nevoie de nicio interschimbare.

```
Intrare:
4
2
2
1
1

Ieșire:
1 1 2 2
```

Valorile duplicate sunt tratate la fel ca orice altă comparație: se
interschimbă doar când sunt strict mai mari.
