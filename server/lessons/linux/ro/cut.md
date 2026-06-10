Comanda **cut** extrage porțiuni din fiecare linie — coloane specifice sau poziții de
caractere. Este perfectă pentru date structurate, cum ar fi CSV-uri sau fișiere separate prin două puncte.

### Decupare după delimitator și câmp cu `-d` și `-f`

```bash
cut -d: -f1 crew_roster.txt
```

Aceasta împarte fiecare linie după `:` și afișează doar câmpul 1. Pentru o linie precum
`Voss:Commander:Deck1`, rezultatul este `Voss`.

Poți selecta mai multe câmpuri:

```bash
cut -d: -f1,3 crew_roster.txt
```

Output: `Voss:Deck1` (câmpurile 1 și 3).

### Decupare după poziția caracterelor cu `-c`

```bash
cut -c1-4 codes.txt
```

Această comandă afișează caracterele de la 1 la 4 din fiecare linie — util pentru date
cu lățime fixă.

### Într-un pipeline

```bash
cat data.csv | cut -d, -f2
```

Extrage a doua coloană separată prin virgulă dintr-un flux CSV.

---

## Misiune: Listă rapidă din manifestul de cargo

Naveta de aprovizionare andochează în câteva minute, iar ofițerul de punte are nevoie de o listă simplă cu numele articolelor din `manifest.csv` — fără cantități, fără destinații, doar articolele.

Folosește `cut` ca să extragi **doar numele articolelor** (câmpul 1) din `manifest.csv`, care este delimitat prin virgulă.

**Rezultat așteptat**

O listă cu numele articolelor, câte unul pe linie, fără alte coloane.
