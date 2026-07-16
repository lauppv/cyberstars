Comanda **uniq** elimină liniile duplicate **adiacente**. Acesta este un detaliu esențial —
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

## Misiune: Audit acces la uși

Securitatea a semnalat activitate neobișnuită pe Puntea 7. Fișierul `acces_usa.log` înregistrează fiecare membru al echipajului care a trecut prin ușă. Află cine a intrat și ieșit cel mai des, apoi arhivează bilanțul.

1. Combină `sort` și `uniq -c` printr-un pipe pe `acces_usa.log` ca să numeri de câte ori a accesat ușa fiecare membru al echipajului, și afișează.
2. Salvează acel bilanț într-un fișier nou numit `bilant-acces.txt`.
3. Creează un folder numit `securitate` și mută `bilant-acces.txt` în el.
4. Caută în bilanț `Voss` ca să confirmi membrul echipajului cu cele mai multe intrări.

**Rezultat așteptat**

`securitate/bilant-acces.txt` conține fiecare nume o singură dată, precedat de numărul de accesări; `Voss` are cele mai multe (3).
