**Comentariile** sunt folosite pentru a **explica** codul sau pentru a **dezactiva** anumite părți din cod
În Python, un comentariu începe cu semnul **#**

```py
# acesta este un comentariu
a = 1 + 2 + 3
print(a) # afiseaza variabila a
```

Acest program funcționează așa cum ne așteptam

```py
# acum vreau sa dezactivez ceva in program
# fara sa-l sterg
a = 1 + 2 + 3
# print(a)
```

Putem vedea că acum programul nu mai afișează nimic deoarece am comentat print(), adică l-am dezactivat

Folosim adesea comentariile pentru a dezactiva bucăți de cod fără să le ștergem

Poate ai văzut și texte între trei ghilimele, folosite ca un fel de comentariu pe mai multe linii

```py
'''
Acesta este un text
pe mai multe linii
1
2
3
'''
```

Atenție însă: acesta **nu este un comentariu adevărat**. Este de fapt un **string** care plutește în cod — Python îl citește, îl evaluează și apoi îl aruncă, pentru că nu e salvat în nicio variabilă. Pare un comentariu doar pentru că nu are niciun efect vizibil

Un comentariu adevărat începe cu **#** — Python îl ignoră complet, nici măcar nu îl citește ca pe cod. De aceea, dacă vrei să dezactivezi o linie de cod, pui **#** în fața ei; dacă doar o pui între ghilimele, linia devine un string plutitor, nu cod dezactivat

În lecțiile următoare vom folosi doar comentarii cu **#**, chiar dacă se întind pe mai multe linii

```py
# asa vom scrie
# comentariile noastre
# pentru a da indicii
# si pentru a explica de acum incolo
```

---

## Misiune: Cenzurează Jurnalul

Codul din dreapta afișează patru linii despre rachetă. Dar **viteza vântului** este clasificată — trebuie să o ascunzi **fără să o ștergi**.

**Comentează** singura linie care afișează `viteza_vant` astfel încât programul să arate doar **numele rachetei**, **numele misiunii** și **puterea maximă**. Nu șterge nimic, doar adaugă un `#` — să pui linia între ghilimele nu o transformă în comentariu, ci într-un string plutitor.

**Exemplu**

După ce comentezi linia corectă, programul tău ar trebui să afișeze

```text
Laniakea-Explorer
MARS-IX-5000
804225
```
