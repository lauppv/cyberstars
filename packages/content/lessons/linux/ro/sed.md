Comanda **sed** (stream editor) face transformări de text din mers. Cea mai
folosită utilizare a ei este caută și înlocuiește:

```bash
sed 's/old/new/' fisier.txt
```

`s` vine de la **substitute**. Aceasta înlocuiește **prima** apariție a lui `old` cu
`new` pe fiecare linie.

### Înlocuiește toate aparițiile pe fiecare linie cu `g`

```bash
sed 's/error/WARNING/g' jurnal.txt
```

`g`-ul de la final (de la _global_) înlocuiește fiecare potrivire de pe linie, nu doar
prima.

### sed nu modifică fișierul original

Implicit, `sed` afișează rezultatul la stdout. Fișierul rămâne neschimbat. Ca să-l
salvezi, folosește redirectarea:

```bash
sed 's/old/new/g' date.txt > date_reparate.txt
```

### Delimitatori

`/` este convenția, dar poți folosi orice caracter:

```bash
sed 's|/usr/bin|/opt/bin|g' cai.txt
```

Folosirea lui `|` evită să escapezi toate slash-urile.

---

## Misiune: Corectarea Raportului de Inspecție

Stația a trecut reinspecția de siguranță: fiecare test picat a fost rulat din nou și a trecut. `raport.txt` arată încă rezultatele vechi, iar regulile inspecției spun că un rezultat retestat se scrie `PASS (retest)`, ca delegația să vadă care au fost rulate de două ori. Salvează raportul corectat ca `arhiva/raport-curat.txt`, făcut din `raport.txt`, nu scris din nou.

**Rezultat așteptat**

`arhiva/raport-curat.txt` are fiecare test picat marcat `PASS (retest)`, pe celelalte cum erau, și niciun `FAIL` rămas.
