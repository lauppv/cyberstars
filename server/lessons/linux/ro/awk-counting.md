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

`/error/` este un tipar — doar liniile care conțin "error" declanșează acțiunea. La
final, afișăm câte s-au potrivit.

### Combinarea tiparului cu calculul

```bash
awk '$3 > 100 {print $1, $3}' date.txt
```

Aceasta afișează câmpurile 1 și 3 doar pentru liniile în care câmpul 3 este mai
mare decât 100. Tiparele awk pot fi regex (`/word/`) sau condiții
(`$2 == "alpha"`).

---

## Misiune: Raport greutate marfă

Stația se apropie de o manevră cu asistență gravitațională, iar pilotul are nevoie de un raport complet al masei încărcăturii. Fișierul `greutate_marfa.txt` listează fiecare obiect și greutatea sa în coloana 2.

1. Adună fiecare greutate din coloana 2 și afișează totalul combinat.
2. Salvează acel total într-un fișier nou numit `greutate-totala.txt`.
3. Listează doar obiectele grele — cele cu o greutate peste 100 — arătând numele și greutatea.
4. Creează un folder numit `punte-zbor` și mută `greutate-totala.txt` în el.

**Rezultat așteptat**

`punte-zbor/greutate-totala.txt` conține greutatea combinată a tuturor obiectelor din marfă (`610`).
