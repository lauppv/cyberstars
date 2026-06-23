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

Există și comentarii pe mai multe linii

```py
'''
Acesta este un
comentariu pe
mai multe linii
1
2
3
'''
```

Totuși, în lecțiile următoare vom folosi comentarii cu **#**, chiar dacă se întind pe mai multe linii

```py
# asa vom scrie
# comentariile noastre
# pentru a da indicii
# si pentru a explica de acum incolo
```

---

## Misiune: Cenzurează Jurnalul

Codul din dreapta afișează patru linii despre rachetă. Dar **viteza vântului** este clasificată — trebuie să o ascunzi **fără să o ștergi**.

**Comentează** singura linie care afișează `wind_speed` astfel încât programul să arate doar **numele navei**, **numele misiunii** și **puterea maximă**. Nu șterge nimic, doar adaugă un `#`.

**Exemplu**

După ce comentezi linia corectă, programul tău ar trebui să afișeze

```text
Laniakea-Explorer
MARS-IX-5000
804225
```
