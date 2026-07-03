Simpla comandă `ls` îți oferă o listă rapidă, dar ascunde unele lucruri și omite
detalii utile. Comenzile acceptă adesea **opțiuni** — flag-uri suplimentare care
încep cu `-` și le modifică comportamentul.

### Afișează fișierele ascunse: `ls -a`

Fișierele al căror nume începe cu un punct (`.`) sunt **ascunse**. Simpla comandă
`ls` nu le afișează. Opțiunea `-a` (de la **all**) le scoate la iveală:

```bash
ls -a
```

```text
.  ..  .secret.txt  echipaj.txt  misiune.txt
```

Vei vedea și `.` (directorul curent) și `..` (directorul părinte) — mai multe
despre acestea în lecția următoare.

### Afișează detalii: `ls -l`

Opțiunea `-l` (format **long**) afișează câte un element pe linie cu informații
suplimentare:

```bash
ls -l
```

```text
-rw-r--r-- 1 student student   14 May 16 10:00 echipaj.txt
drwxr-xr-x 2 student student 4096 May 16 10:00 rapoarte
```

Primul caracter îți spune tipul:

- `-` înseamnă **fișier**
- `d` înseamnă **director**

Așa că, în sfârșit, poți deosebi fișierele de foldere. (Celelalte coloane —
permisiuni, dimensiune, dată — sunt acoperite în capitolele următoare.)

### Combină opțiunile: `ls -la`

Opțiunile pot fi combinate într-una singură. `ls -la` înseamnă „format long **și**
afișează toate":

```bash
ls -la
```

Poți scrie `ls -la`, `ls -al` sau `ls -l -a` — toate au același efect.

---

## Misiune: Descoperă Fișierele Ascunse

Securitatea stației a semnalat un fișier ascuns undeva în directorul tău personal. Scanările obișnuite l-au ratat pentru că fișierele ascunse nu apar într-o listare simplă.

Folosește `ls` cu opțiunile potrivite pentru a lista **toate** elementele (inclusiv pe cele ascunse) în format **long**.

**Rezultat așteptat**

Vezi fiecare element — inclusiv fișierul ascuns care începe cu `.` — împreună cu detaliile care arată care intrări sunt fișiere și care sunt directoare.
