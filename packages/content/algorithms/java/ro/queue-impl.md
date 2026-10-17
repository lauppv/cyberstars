Implementează o clasă **Coada** folosind un `ArrayList` ca stocare internă. Coada trebuie să suporte operațiile `adauga`, `scoate` și `varf`, urmând principiul FIFO (First In, First Out: primul intrat, primul ieșit).

Procesează comenzile de la stdin și afișează rezultatele pentru `scoate` și `varf`. Dacă `scoate` sau `varf` este apelat pe o coadă goală, afișează `Goala`.

### Date de intrare

- Linia 1: numărul de comenzi N (1 <= N <= 2·10^4)
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`adauga`, `scoate` sau `varf`)
  - Doar pentru `adauga`, linia 2: numărul întreg X (orice valoare de tip `int`)

Comportament:

- `adauga X`: adaugă X la spatele cozii
- `scoate`: elimină și afișează elementul din față
- `varf`: afișează elementul din față fără a-l elimina

### Rezultat

- Pentru fiecare `scoate`: valoarea eliminată, sau `Goala`
- Pentru fiecare `varf`: valoarea din față, sau `Goala`

### Exemple

```
Intrare:
6
adauga
10
adauga
20
varf
scoate
scoate
scoate

Ieșire:
10
10
20
Goala
```

```visual
{
  "type": "stack",
  "queue": true,
  "ends": true,
  "caption": "O coadă: valorile ies în ordinea în care au venit, ca oamenii la un rând. Intră în spate, iar scoate și varf lucrează cu fața.",
  "steps": [
    {"push": [{"id": "v1", "text": 10}], "focus": ["v1"], "caption": "adauga 10: 10 intră în coada goală"},
    {"push": [{"id": "v2", "text": 20}], "focus": ["v2"], "caption": "adauga 20: 20 intră în spate, după 10"},
    {"ask": "Ce afișează varf?", "focus": ["v1"], "caption": "10: varf arată fața și o lasă pe loc"},
    {"ask": "Ce afișează scoate?", "pop": 1, "focus": ["v1"], "caption": "10: scoate scoate fața din coadă. Acum 20 e în față"},
    {"ask": "Ce afișează scoate?", "pop": 1, "focus": ["v2"], "caption": "20: scoate scoate fața din coadă. Acum coada e goală"},
    {"ask": "Ce afișează scoate?", "caption": "Goala: coada e goală, deci nu e nimic de scos"}
  ]
}
```

```
Intrare:
4
adauga
5
adauga
15
scoate
varf

Ieșire:
5
15
```

```
Intrare:
2
scoate
varf

Ieșire:
Goala
Goala
```

Atât `scoate`, cât și `varf` trebuie să afișeze `Goala` când coada nu conține nimic.
