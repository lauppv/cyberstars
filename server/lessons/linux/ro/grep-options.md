Comanda `grep` simplă este utilă, dar câteva opțiuni o fac mult mai inteligentă.

### Ignoră majusculele/minusculele: `grep -i`

În mod implicit, `grep` ține cont de majuscule — `Error` și `error` sunt diferite.
Opțiunea `-i` face căutarea **insensibilă la majuscule/minuscule**:

```bash
grep -i error sistem.log
```

Astfel se potrivesc `error`, `Error`, `ERROR` și orice combinație.

### Numără potrivirile: `grep -c`

Opțiunea `-c` afișează doar **numărul** de linii care se potrivesc, nu și liniile în
sine:

```bash
grep -c warning sistem.log
```

```text
3
```

### Inversează potrivirea: `grep -v`

Opțiunea `-v` inversează căutarea — afișează liniile care **NU** conțin cuvântul:

```bash
grep -v info sistem.log
```

Astfel se ascund toate liniile cu `info` și se afișează tot restul.

### Afișează numerele liniilor: `grep -n`

Opțiunea `-n` pune **numărul liniei** în fața fiecărei potriviri:

```bash
grep -n error sistem.log
```

```text
5:error: sensor 3 offline
```

Opțiunile se pot combina, la fel ca la `ls`: `grep -in error sistem.log` este
insensibilă la majuscule _și_ numerotată.

---

## Misiune: Raport de final de tură

Înainte de a preda schimbul echipajului de noapte, trebuie să pregătești un rezumat
al fișierului `sistem.log`: câte avertismente s-au înregistrat, ce evenimente
neobișnuite au avut loc și o copie depusă pentru tura următoare.

1. Numără câte linii conțin `warning` — doar numărul, nu și liniile în sine.
2. Afișează fiecare linie care **nu** conține `info` — evenimentele neobișnuite.
3. Afișează liniile cu `error` cu un număr de linie în față, ca echipajul de noapte să
   sară direct la ele.
4. Creează un folder numit `predare` și copiază `sistem.log` în el sub numele
   `brief-noapte.log`.

**Rezultat așteptat**

Vezi numărul de avertismente, liniile neobișnuite filtrate, linia de eroare numerotată
și o copie a jurnalului care așteaptă în `predare`.
