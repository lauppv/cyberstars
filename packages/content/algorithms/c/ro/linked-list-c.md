Implementează o **listă simplu înlănțuită** în C. Citește comenzi de la stdin și execută-le:

- `insereaza x`: inserează numărul întreg `x` la **finalul** listei
- `afiseaza`: afișează toate elementele separate prin spații pe o singură linie

Folosește `malloc` pentru a aloca fiecare nod. Fiecare nod are un câmp `int data` și un pointer `struct Nod *urmator`.

### Date de intrare

- Prima linie: un întreg `N` (1 <= N <= 2·10^4), numărul de comenzi
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`insereaza` sau `afiseaza`)
  - Doar pentru `insereaza`, linia 2: numărul întreg `x` (-10^9 <= x <= 10^9)

### Rezultat

Pentru fiecare comandă `afiseaza`, afișează elementele listei separate prin spații. Dacă lista este goală, afișează `Goala`.

### Exemple

```
Intrare:
5
insereaza
10
insereaza
20
insereaza
30
afiseaza
insereaza
40
Ieșire:
10 20 30
```

```visual
{
  "type": "boxes",
  "caption": "O listă înlănțuită e un lanț de noduri: fiecare ține data lui și un pointer urmator spre nodul de după el. cap arată spre primul nod, iar urmator al ultimului nod e NULL. Acum lista e goală: cap e NULL.",
  "boxes": [
    {"id": "head", "name": "cap", "to": null, "shown": true},
    {"id": "n10", "fields": [{"name": "data", "value": 10}, {"name": "urmator", "to": null}]},
    {"id": "n20", "fields": [{"name": "data", "value": 20}, {"name": "urmator", "to": null}]},
    {"id": "n30", "fields": [{"name": "data", "value": 30}, {"name": "urmator", "to": null}]},
    {"id": "n40", "fields": [{"name": "data", "value": 40}, {"name": "urmator", "to": null}]}
  ],
  "steps": [
    {"title": "insereaza 10", "focus": ["head"], "ask": "Lista e goală?", "show": ["n10"], "point": {"head": "n10"}, "caption": "Da, cap e NULL, deci cap arată acum spre nodul nou 10, al cărui urmator e NULL"},
    {"title": "insereaza 20", "focus": ["n10"], "ask": "Unde ajunge 20?", "show": ["n20"], "point": {"n10.urmator": "n20"}, "caption": "La final: urmator lui 10 arată acum spre nodul nou 20, iar urmator lui 20 e NULL"},
    {"title": "insereaza 30", "focus": ["n20"], "ask": "Unde ajunge 30?", "show": ["n30"], "point": {"n20.urmator": "n30"}, "caption": "La final: urmator lui 20 arată acum spre nodul nou 30, iar urmator lui 30 e NULL"},
    {"title": "afiseaza", "focus": ["n10", "n20", "n30"], "caption": "afiseaza urmează săgețile de la cap: 10, 20, 30, iar NULL încheie lista. Afișează 10 20 30"},
    {"title": "insereaza 40", "focus": ["n30"], "ask": "Unde ajunge 40?", "show": ["n40"], "point": {"n30.urmator": "n40"}, "caption": "La final: urmator lui 30 arată acum spre nodul nou 40. Afișarea a venit înainte, deci rezultatul rămâne 10 20 30"}
  ]
}
```

```
Intrare:
3
afiseaza
insereaza
5
afiseaza
Ieșire:
Goala
5
```

```
Intrare:
2
insereaza
7
afiseaza
Ieșire:
7
```

O listă cu un singur nod afișează tot doar acea valoare, fără spațiu la final.
