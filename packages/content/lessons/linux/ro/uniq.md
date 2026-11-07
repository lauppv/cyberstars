Comanda **uniq** elimină liniile duplicate **adiacente**. Acesta este un detaliu esențial:
funcționează doar pe linii care sunt una lângă alta. De aceea, aproape întotdeauna se face
mai întâi **sort** și apoi se trimite prin pipe spre `uniq`.

```bash
sort acces.log | uniq
```

Această comandă elimină toate duplicatele și afișează fiecare linie unică o singură dată.

### Numărarea duplicatelor cu `-c`

```bash
sort acces.log | uniq -c
```

```text
      3 deck 1
      1 deck 3
      2 deck 7
```

Fiecare linie este precedată de numărul de apariții. E un tipar incredibil de util
pentru analize rapide de date.

### De ce sortăm întâi?

Fără sortare, `uniq` colapsează doar secvențele de linii identice consecutive:

```text
alpha
alpha    <- eliminata (duplicat adiacent)
beta
alpha    <- NU este eliminata (nu este adiacenta)
```

Combinația `sort | uniq` este atât de des folosită încât merită să o ai în memoria musculară.

---

## Misiune: Auditul Accesului pe Ușă

Securitatea a semnalat activitate neobișnuită pe Puntea 7. `acces_usa.log` înregistrează fiecare membru al echipajului care a trecut cardul pe ușă, câte un nume la fiecare trecere. Securitatea vrea un bilanț în `securitate/bilant-acces.txt`: fiecare nume o singură dată, cu de câte ori a trecut, cel mai activ primul.

**Rezultat așteptat**

`securitate/bilant-acces.txt` are câte o linie pentru fiecare membru al echipajului, un număr înaintea fiecărui nume, de la cele mai multe treceri la cele mai puține.
