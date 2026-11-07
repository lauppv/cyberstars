Pe lângă afișarea câmpurilor, awk poate să **calculeze**. Poți folosi variabile,
tipare și blocuri speciale precum `END` ca să produci rezumate.

### Adunarea unei coloane

```bash
awk '{sum += $2} END {print sum}' citiri.txt
```

Aceasta adună fiecare valoare din coloana 2 și afișează totalul după ce toate
liniile sunt procesate. Blocul `END` rulează o singură dată, după ultima linie.

### Numărarea liniilor care se potrivesc cu un tipar

```bash
awk '/error/ {count++} END {print count}' jurnal.txt
```

`/error/` este un tipar: doar liniile care conțin "error" declanșează acțiunea. La
final, afișăm câte s-au potrivit.

### Combinarea tiparului cu calculul

```bash
awk '$3 > 100 {print $1, $3}' date.txt
```

Aceasta afișează câmpurile 1 și 3 doar pentru liniile în care câmpul 3 este mai
mare decât 100. Tiparele awk pot fi regex (`/word/`) sau condiții
(`$2 == "alpha"`).

---

## Misiune: Raportul Greutății Mărfii

Stația se apropie de o manevră de asistență gravitațională, iar pilotul are nevoie de masa mărfii. `greutate_marfa.txt` listează fiecare obiect cu greutatea lui. Într-un folder nou `punte-zbor`, salvează greutatea totală a mărfii, doar numărul, ca `greutate-totala.txt`, și fiecare obiect mai greu de 100 cu greutatea lui ca `grele.txt`.

**Rezultat așteptat**

`punte-zbor/greutate-totala.txt` ține un singur număr, iar `punte-zbor/grele.txt` doar obiectele de peste 100, fiecare cu greutatea lui.
