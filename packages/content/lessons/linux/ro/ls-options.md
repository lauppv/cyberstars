Simpla comandă `ls` îți oferă o listă rapidă, dar ascunde unele lucruri și omite
detalii utile. Comenzile acceptă adesea **opțiuni**: flag-uri suplimentare care
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

Vei vedea și `.` (directorul curent) și `..` (directorul părinte). Mai multe
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

- `-` înseamnă fișier
- `d` înseamnă director

Așa că, în sfârșit, poți deosebi fișierele de foldere. (Celelalte coloane,
permisiuni, dimensiune, dată, sunt acoperite în capitolele următoare.)

### Combină opțiunile: `ls -la`

Opțiunile pot fi combinate într-una singură. `ls -la` înseamnă „format long și
afișează toate":

```bash
ls -la
```

Poți scrie `ls -la`, `ls -al` sau `ls -l -a`: toate au același efect.

---

## Misiune: Descoperă Fișierele Ascunse

Securitatea stației spune că un fișier se ascunde în directorul tău personal, unde o listare simplă nu-l arată. Vor o singură comandă care listează directorul tău personal cu toate elementele, inclusiv cele ascunse, și care deosebește fișierele de foldere. Apoi vor aceleași detalii pentru ce se află în `rapoarte`, fără să intri acolo.

**Rezultat așteptat**

Poți numi fișierul ascuns, poți spune care intrări sunt foldere și poți da mărimea fișierului păstrat în `rapoarte`.
