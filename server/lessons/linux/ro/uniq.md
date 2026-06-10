Comanda **uniq** elimină liniile duplicate **adiacente**. Acesta este un detaliu esențial —
funcționează doar pe linii care sunt una lângă alta. De aceea, aproape întotdeauna se face
mai întâi **sort** și apoi se trimite prin pipe spre `uniq`.

```bash
sort access.log | uniq
```

Această comandă elimină toate duplicatele și afișează fiecare linie unică o singură dată.

### Numărarea duplicatelor cu `-c`

```bash
sort access.log | uniq -c
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
alpha    ← eliminată (duplicat adiacent)
beta
alpha    ← NU este eliminată (nu este adiacentă)
```

Combinația `sort | uniq` este atât de des folosită încât merită să o ai în memoria musculară.

---

## Misiune: Audit acces la uși

Securitatea a semnalat activitate neobișnuită pe Puntea 7. Fișierul `door_access.log` înregistrează fiecare membru al echipajului care a trecut prin ușă. Află cine a intrat și ieșit cel mai des.

Combină `sort` și `uniq -c` prin pipe pe `door_access.log` pentru a număra de câte ori a accesat ușa fiecare membru al echipajului.

**Rezultat așteptat**

Numele fiecărui membru al echipajului apare o singură dată, precedat de numărul său de accesări. Ar trebui să vezi că Voss a avut cele mai multe intrări (3).
