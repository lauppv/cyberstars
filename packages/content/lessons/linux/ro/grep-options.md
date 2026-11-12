Comanda `grep` simplă este utilă, dar câteva opțiuni o fac mult mai inteligentă.

### Ignoră majusculele/minusculele: `grep -i`

În mod implicit, `grep` ține cont de majuscule: `Error` și `error` sunt diferite.
Opțiunea `-i` face căutarea **insensibilă la majuscule/minuscule**:

```bash
grep -i error sistem.log
```

Astfel se potrivesc `error`, `Error`, `ERROR` și orice combinație.

### Numără potrivirile: `grep -c`

Opțiunea `-c` afișează doar numărul de linii care se potrivesc, nu și liniile în
sine:

```bash
grep -c warning sistem.log
```

```text
3
```

### Inversează potrivirea: `grep -v`

Opțiunea `-v` inversează căutarea: afișează liniile care **NU** conțin cuvântul:

```bash
grep -v info sistem.log
```

Astfel se ascund toate liniile cu `info` și se afișează tot restul.

### Afișează numerele liniilor: `grep -n`

Opțiunea `-n` pune numărul liniei în fața fiecărei potriviri:

```bash
grep -n error sistem.log
```

```text
5:error: sensor 3 offline
```

Opțiunile se pot combina, la fel ca la `ls`: `grep -in error sistem.log` este
insensibilă la majuscule _și_ numerotată.

---

## Misiune: Rezumatul de Final de Tură

Înainte să predai tura echipei de noapte, rezumă `sistem.log` în trei căutări:

1. Câte linii de rutină `info` s-au înregistrat? Doar numărul, nu liniile.
2. Tot ce nu e un `warning`, ca echipa de noapte să vadă restul dintr-o privire.
3. Liniile `warning`, fiecare cu poziția ei în fișier, ca echipa să sară direct la ele.

Apoi păstrează o copie a jurnalului pentru tura următoare ca `predare/brief-noapte.log`.

**Rezultat așteptat**

Vezi un singur număr, apoi liniile fără avertismente, apoi avertismentele cu numerele lor de linie, iar copia așteaptă în `predare`.
