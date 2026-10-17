Implementează o **listă simplu înlănțuită** de la zero. Creează o clasă `Nod` cu câmpurile `valoare` și `urmator`, și o clasă `ListaInlantuita` cu operațiile `adauga`, `elimina` și `afiseaza`.

Procesează comenzile de la stdin.

### Date de intrare

- Linia 1: numărul de comenzi N (1 <= N <= 2·10^4)
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`adauga`, `elimina` sau `afiseaza`)
  - Doar pentru `adauga` și `elimina`, linia 2: numărul întreg X (orice valoare de tip `int`)

Comportament:

- `adauga X`: adaugă numărul întreg X la sfârșitul listei
- `elimina X`: elimină prima apariție a lui X (afișează `Negasit` dacă X nu se află în listă)
- `afiseaza`: afișează toate elementele separate prin `->`, sau `Goala` dacă lista este goală

### Rezultat

- Pentru fiecare `afiseaza`: elementele în ordine separate prin `->`, sau `Goala`
- Pentru fiecare `elimina` eșuat: `Negasit`

### Exemple

```
Intrare:
6
adauga
10
adauga
20
adauga
30
afiseaza
elimina
20
afiseaza

Ieșire:
10 -> 20 -> 30
10 -> 30
```

```visual
{
  "type": "boxes",
  "caption": "O listă înlănțuită e un lanț de noduri: fiecare ține valoare lui și o referință urmator spre nodul de după el. cap arată spre primul nod, iar urmator al ultimului nod e null. Acum lista e goală: cap e null.",
  "null": "null",
  "boxes": [
    {"id": "head", "name": "cap", "to": null, "shown": true},
    {"id": "n10", "fields": [{"name": "valoare", "value": 10}, {"name": "urmator", "to": null}]},
    {"id": "n20", "fields": [{"name": "valoare", "value": 20}, {"name": "urmator", "to": null}]},
    {"id": "n30", "fields": [{"name": "valoare", "value": 30}, {"name": "urmator", "to": null}]}
  ],
  "steps": [
    {"title": "adauga 10", "focus": ["head"], "ask": "Lista e goală?", "show": ["n10"], "point": {"head": "n10"}, "caption": "Da, cap e null, deci cap arată acum spre nodul nou 10, al cărui urmator e null"},
    {"title": "adauga 20", "focus": ["n10"], "ask": "Unde ajunge 20?", "show": ["n20"], "point": {"n10.urmator": "n20"}, "caption": "La final: urmator lui 10 arată acum spre nodul nou 20, iar urmator lui 20 e null"},
    {"title": "adauga 30", "focus": ["n20"], "ask": "Unde ajunge 30?", "show": ["n30"], "point": {"n20.urmator": "n30"}, "caption": "La final: urmator lui 20 arată acum spre nodul nou 30, iar urmator lui 30 e null"},
    {"title": "afiseaza", "focus": ["n10", "n20", "n30"], "caption": "afiseaza urmează săgețile de la cap: 10, 20, 30, iar null încheie lista. Afișează 10 -> 20 -> 30"},
    {"title": "elimina 20", "focus": ["n10", "n20"], "ask": "Ce săgeată duce la 20?", "point": {"n10.urmator": "n30"}, "caption": "urmator lui 10. Acum sare peste 20 și arată spre 30, nodul de după 20"},
    {"remove": ["n20"], "caption": "Nimic nu mai arată spre 20, deci a ieșit din listă"},
    {"title": "afiseaza", "focus": ["n10", "n30"], "caption": "afiseaza urmează săgețile de la cap: 10, apoi 30, iar null încheie lista. Afișează 10 -> 30"}
  ]
}
```

```
Intrare:
4
adauga
5
elimina
5
elimina
5
afiseaza

Ieșire:
Negasit
Goala
```

```
Intrare:
5
adauga
1
adauga
2
adauga
3
elimina
1
afiseaza

Ieșire:
2 -> 3
```

Eliminarea nodului **cap** înseamnă că referința `cap` a listei trebuie
mutată chiar ea către al doilea nod. Nu există un nod „anterior” de relegat.
