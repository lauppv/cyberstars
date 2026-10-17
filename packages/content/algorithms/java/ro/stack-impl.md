Implementează o clasă **Stiva** folosind un `ArrayList` ca stocare internă. Stiva trebuie să suporte operațiile `pune`, `scoate` și `varf`.

Procesează comenzile de la stdin și afișează rezultatele pentru `scoate` și `varf`. Dacă `scoate` sau `varf` este apelat pe o stivă goală, afișează `Goala`.

### Date de intrare

- Linia 1: numărul de comenzi N (1 <= N <= 2·10^4)
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`pune`, `scoate` sau `varf`)
  - Doar pentru `pune`, linia 2: numărul întreg X (orice valoare de tip `int`)

Comportament:

- `pune X`: pune X pe stivă
- `scoate`: elimină și afișează elementul din vârf
- `varf`: afișează elementul din vârf fără a-l elimina

### Rezultat

- Pentru fiecare `scoate`: valoarea eliminată, sau `Goala`
- Pentru fiecare `varf`: valoarea din vârf, sau `Goala`

### Exemple

```
Intrare:
6
pune
10
pune
20
varf
scoate
scoate
scoate

Ieșire:
20
20
10
Goala
```

```visual
{
  "type": "stack",
  "ends": true,
  "caption": "O stivă: ultima valoare pusă e prima care iese, ca farfuriile puse una peste alta. scoate și varf lucrează amândouă cu vârful.",
  "steps": [
    {"push": [{"id": "v1", "text": 10}], "focus": ["v1"], "caption": "pune 10: 10 ajunge pe stiva goală"},
    {"push": [{"id": "v2", "text": 20}], "focus": ["v2"], "caption": "pune 20: 20 ajunge deasupra lui 10"},
    {"ask": "Ce afișează varf?", "focus": ["v2"], "caption": "20: varf arată vârful și îl lasă pe loc"},
    {"ask": "Ce afișează scoate?", "pop": 1, "focus": ["v2"], "caption": "20: scoate ia vârful de pe stivă. Acum 10 e în vârf"},
    {"ask": "Ce afișează scoate?", "pop": 1, "focus": ["v1"], "caption": "10: scoate ia vârful de pe stivă. Acum stiva e goală"},
    {"ask": "Ce afișează scoate?", "caption": "Goala: stiva e goală, deci nu e nimic de luat"}
  ]
}
```

```
Intrare:
3
pune
5
pune
15
varf

Ieșire:
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

Atât `scoate`, cât și `varf` trebuie să afișeze `Goala` când stiva nu conține nimic.
