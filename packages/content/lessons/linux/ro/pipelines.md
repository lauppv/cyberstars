Un singur pipe este util. Un **pipeline** de trei sau mai multe comenzi este însă locul
în care Linux strălucește cu adevărat. Fiecare comandă face o treabă și pasează
rezultatul mai departe.

```bash
cat acces.log | grep "denied" | wc -l
```

```text
3
```

Acest pipeline: (1) citește fișierul, (2) păstrează doar liniile cu „denied", (3) le
numără.

### Sortare într-un pipeline

```bash
cat nume.txt | sort | head -3
```

Acest pipeline afișează primele 3 nume în ordine alfabetică: `sort` le reordonează,
`head` le scurtează.

### Construire pas cu pas

Cel mai bun mod de a construi un pipeline este **incremental**:

1. Pornește de la sursa datelor: `cat fișier`
2. Adaugă o comandă, verifică rezultatul.
3. Adaugă următoarea comandă, verifică din nou.

Dacă ceva nu merge, scoate ultimul pipe și inspectează rezultatul intermediar.

### Comenzi des întâlnite în pipeline-uri

| Comandă         | Rol în pipeline             |
| --------------- | --------------------------- |
| `grep`          | Filtrează linii             |
| `sort`          | Reordonează linii           |
| `wc -l`         | Numără linii                |
| `head` / `tail` | Ia primele/ultimele N linii |

---

## Misiune: Briefing cu Alertele Prioritare

Echipajul de pe punte are nevoie de un briefing din `evenimente.log` de azi: doar liniile `alert`, în ordine alfabetică, și doar primele două dintre ele. Salvează-l ca `punte/briefing.txt`, făcut într-o singură linie direct din jurnal, fără nimic salvat între pași.

**Rezultat așteptat**

`punte/briefing.txt` ține două linii de alertă, primele două în ordine alfabetică.
