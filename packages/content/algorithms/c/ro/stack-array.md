Implementează o structură de date de tip **stivă** folosind un tablou. Citește o secvență de comenzi și procesează-le:

- **pune X**: adaugă numărul întreg X în vârful stivei
- **scoate**: elimină și afișează elementul din vârf, sau afișează `Goala` dacă stiva este goală
- **varf**: afișează elementul din vârf fără a-l elimina, sau afișează `Goala` dacă stiva este goală

### Date de intrare

- Prima linie: un întreg `M` (1 <= M <= 2·10^4), numărul de comenzi
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`pune`, `scoate` sau `varf`)
  - Doar pentru `pune`, linia 2: numărul întreg X (-10^9 <= X <= 10^9)

### Rezultat

Pentru fiecare comandă `scoate` sau `varf`, afișează o linie: valoarea sau `Goala`.

### Exemple

```
Intrare:
5
pune
10
pune
20
varf
scoate
scoate
Ieșire:
20
20
10
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
    {"ask": "Ce afișează scoate?", "pop": 1, "focus": ["v1"], "caption": "10: scoate ia vârful de pe stivă. Acum stiva e goală"}
  ]
}
```

```
Intrare:
3
scoate
pune
5
varf
Ieșire:
Goala
5
```

```
Intrare:
5
pune
1
pune
2
scoate
scoate
scoate
Ieșire:
2
1
Goala
```

Odată ce stiva e complet golită, apelurile `scoate` următoare afișează în continuare `Goala`.
