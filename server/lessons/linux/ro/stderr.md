Linux separă rezultatul unei comenzi în două fluxuri:

- **stdout** (fluxul 1) — rezultatul normal (ce vezi de obicei).
- **stderr** (fluxul 2) — mesajele de eroare.

Când folosești `>`, se redirecționează doar stdout. Erorile tot apar pe ecran:

```bash
ls real.txt fake.txt > output.txt
```

```text
ls: cannot access 'fake.txt': No such file or directory
```

Listarea pentru `real.txt` a ajuns în `output.txt`, dar eroarea a rămas pe ecran.

### Redirecționarea erorilor cu `2>`

```bash
ls real.txt fake.txt 2> errors.txt
```

Acum erorile merg în `errors.txt`, iar rezultatul normal se afișează pe ecran.

### Aruncarea erorilor în `/dev/null`

`/dev/null` este o gaură neagră — orice trimiți acolo dispare:

```bash
ls real.txt fake.txt 2> /dev/null
```

Rămâne doar rezultatul reușit; erorile dispar în tăcere.

### Combinarea ambelor fluxuri cu `2>&1`

```bash
ls real.txt fake.txt > all.txt 2>&1
```

Asta trimite **ambele** fluxuri, stdout și stderr, în `all.txt`. `2>&1` înseamnă „trimite
fluxul 2 acolo unde merge fluxul 1".

---

## Misiune: Investigația fișierului fantomă

Senzorii stației au semnalat o referință la un fișier numit `ghost.txt` care s-ar putea să nu mai existe. Trebuie să rulezi `ls report.txt ghost.txt` ca să verifici ambele fișiere, dar mesajul de eroare îți aglomerează consola principală.

Redirecționează **doar eroarea** într-un fișier numit `errors.log` folosind `2>`, ca rezultatul normal să rămână pe ecran și eroarea să fie captată separat.

**Rezultat așteptat**

Terminalul afișează `report.txt` pe ecran, iar `cat errors.log` dezvăluie eroarea „No such file" pentru `ghost.txt`.
