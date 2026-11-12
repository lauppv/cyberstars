Linux separă rezultatul unei comenzi în două fluxuri:

- **stdout** (fluxul 1): rezultatul normal (ce vezi de obicei).
- **stderr** (fluxul 2): mesajele de eroare.

Când folosești `>`, se redirecționează doar stdout. Erorile tot apar pe ecran:

```bash
ls real.txt fals.txt > iesire.txt
```

```text
ls: cannot access 'fals.txt': No such file or directory
```

Listarea pentru `real.txt` a ajuns în `iesire.txt`, dar eroarea a rămas pe ecran.

### Redirecționarea erorilor cu `2>`

```bash
ls real.txt fals.txt 2> erori.txt
```

Acum erorile merg în `erori.txt`, iar rezultatul normal se afișează pe ecran.

### Aruncarea erorilor în `/dev/null`

`/dev/null` este o gaură neagră: orice trimiți acolo dispare:

```bash
ls real.txt fals.txt 2> /dev/null
```

Rămâne doar rezultatul reușit; erorile dispar în tăcere.

### Combinarea ambelor fluxuri cu `2>&1`

```bash
ls real.txt fals.txt > tot.txt 2>&1
```

Asta trimite ambele fluxuri, stdout și stderr, în `tot.txt`. `2>&1` înseamnă „trimite
fluxul 2 acolo unde merge fluxul 1".

---

## Misiune: Investigarea Fișierului Fantomă

Senzorii stației au semnalat o referință la `fantoma.txt`, un fișier care poate nu mai există. Verifică `raport.txt` și `fantoma.txt` într-o singură listare. Ce găsește listarea rămâne pe ecran; orice eroare merge în schimb în `jurnale/erori.log` și niciodată pe ecran.

**Rezultat așteptat**

Pe ecran apare doar `raport.txt`, iar `jurnale/erori.log` ține plângerea despre `fantoma.txt`.
