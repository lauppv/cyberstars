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

Acest pipeline afișează primele 3 nume în ordine alfabetică — `sort` le reordonează,
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

## Misiune: Briefing-ul alertelor prioritare

Echipajul de pe punte are nevoie de un briefing rapid — doar cele mai urgente două alerte din jurnalul de evenimente al zilei, sortate alfabetic, ca să le poată confrunta cu lista de tură.

Construiește un pipeline care citește `evenimente.log`, filtrează liniile care conțin `alert`, le sortează alfabetic și afișează doar **primele 2** rezultate. Pipeline-ul tău trebuie să înlănțuiască cel puțin 3 pipe-uri.

**Rezultat așteptat**

Pe ecran ar trebui să apară două linii cu `alert`, sortate.
