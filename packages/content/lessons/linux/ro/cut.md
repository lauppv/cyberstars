Comanda **cut** extrage porțiuni din fiecare linie: coloane specifice sau poziții de
caractere. Este perfectă pentru date structurate, cum ar fi CSV-uri sau fișiere separate prin două puncte.

### Decupare după delimitator și câmp cu `-d` și `-f`

```bash
cut -d: -f1 lista_echipaj.txt
```

Aceasta împarte fiecare linie după `:` și afișează doar câmpul 1. Pentru o linie precum
`Voss:Commander:Deck1`, rezultatul este `Voss`.

Poți selecta mai multe câmpuri:

```bash
cut -d: -f1,3 lista_echipaj.txt
```

Output: `Voss:Deck1` (câmpurile 1 și 3).

### Decupare după poziția caracterelor cu `-c`

```bash
cut -c1-4 coduri.txt
```

Această comandă afișează caracterele de la 1 la 4 din fiecare linie, util pentru date
cu lățime fixă.

### Într-un pipeline

```bash
cat date.csv | cut -d, -f2
```

Extrage a doua coloană separată prin virgulă dintr-un flux CSV.

---

## Misiune: Lista Rapidă din Manifest

Naveta de aprovizionare andochează în câteva minute. Uită-te cum e așezat `manifest.csv`, apoi fă două liste pentru ofițerul de punte într-un folder nou `birou-punte`:

- `lista-articole.txt` doar cu numele articolelor, câte unul pe linie;
- `destinatii.txt` cu fiecare articol și locul unde merge, așa cum le scrie manifestul, dar fără cantități.

**Rezultat așteptat**

`birou-punte/lista-articole.txt` ține doar numele articolelor, iar `birou-punte/destinatii.txt` articolele cu destinațiile lor, fără nimic între ele.
