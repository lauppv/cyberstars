Comanda **sed** (stream editor) face transformări de text din mers. Cea mai
folosită utilizare a ei este **caută și înlocuiește**:

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

## Misiune: Reparare raport de inspecție

Stația tocmai a trecut reinspectia de siguranță, dar `raport.txt` mai conține rezultate vechi `FAIL` din runda anterioară. Căpitanul vrea un raport curat la dosar înainte să sosească delegația.

1. Folosește `sed` ca să înlocuiești **toate** aparițiile lui `FAIL` cu `PASS` în `raport.txt` și afișează raportul corectat.
2. Salvează raportul corectat într-un fișier nou numit `raport-curat.txt`.
3. Creează un folder numit `arhiva` și mută `raport-curat.txt` în el.
4. Numără câte teste afișează acum `PASS`.

**Rezultat așteptat**

`arhiva/raport-curat.txt` afișează `PASS` pe fiecare linie de test — nicio intrare `FAIL` nu mai rămâne.
