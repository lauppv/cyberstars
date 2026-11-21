Folosește împreună un HashSet, un TreeMap și o buclă

---

## Misiune: Noapte la Clubul Malibu

E o noapte mare la clubul Malibu. Bodyguardul notează fiecare nume care trece pe ușă. Oamenii ies și se întorc, așa că unele nume apar de mai multe ori. Dimineața, Tommy vrea să știe cine a venit, de câte ori și cui i-a plăcut cel mai mult clubul

Numele sunt într-un array `String[] sosiri`, în ordinea în care au venit oamenii. Pentru fiecare, afișează `Bine ai venit, nume` prima dată când apare numele și `Iar aici, nume` de fiecare dată după aceea. Când se termină noaptea, afișează `Cartea de oaspeți:` și apoi fiecare invitat ca `nume: vizite`, sortat după nume. La final afișează `Cel mai fidel: nume`, invitatul cu cele mai multe vizite. Dacă mai mulți invitați au numărul maxim de vizite, alege-l pe cel al cărui nume vine primul în ordine alfabetică. Există mereu cel puțin o sosire

**Exemplu**

```text
Bine ai venit, Tommy
Bine ai venit, Lance
Iar aici, Tommy
Bine ai venit, Candy
Iar aici, Lance
Iar aici, Tommy
Cartea de oaspeți:
Candy: 1
Lance: 2
Tommy: 3
Cel mai fidel: Tommy
```

**Exemplu**

```text
Bine ai venit, Phil
Bine ai venit, Kent
Cartea de oaspeți:
Kent: 1
Phil: 1
Cel mai fidel: Kent
```
