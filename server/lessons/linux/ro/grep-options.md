Comanda `grep` simplă este utilă, dar câteva opțiuni o fac mult mai inteligentă.

### Ignoră majusculele/minusculele: `grep -i`

În mod implicit, `grep` ține cont de majuscule — `Error` și `error` sunt diferite.
Opțiunea `-i` face căutarea **insensibilă la majuscule/minuscule**:

```bash
grep -i error system.log
```

Astfel se potrivesc `error`, `Error`, `ERROR` și orice combinație.

### Numără potrivirile: `grep -c`

Opțiunea `-c` afișează doar **numărul** de linii care se potrivesc, nu și liniile în
sine:

```bash
grep -c warning system.log
```

```text
3
```

### Inversează potrivirea: `grep -v`

Opțiunea `-v` inversează căutarea — afișează liniile care **NU** conțin cuvântul:

```bash
grep -v info system.log
```

Astfel se ascund toate liniile cu `info` și se afișează tot restul.

### Afișează numerele liniilor: `grep -n`

Opțiunea `-n` pune **numărul liniei** în fața fiecărei potriviri:

```bash
grep -n error system.log
```

```text
5:error: sensor 3 offline
```

Opțiunile se pot combina, la fel ca la `ls`: `grep -in error system.log` este
insensibilă la majuscule _și_ numerotată.

---

## Misiune: Raport de final de tură

Înainte de a preda schimbul echipajului de noapte, trebuie să pregătești un rezumat
al fișierului `system.log`: câte avertismente s-au înregistrat și ce evenimente
neobișnuite au avut loc.

1. Folosește `grep -c warning system.log` pentru a număra câte linii conțin
   `warning`.
2. Folosește `grep -v info system.log` pentru a afișa fiecare linie care **nu**
   conține `info`.

**Rezultat așteptat**

Mai întâi vezi numărul de avertismente (un singur număr), apoi liniile filtrate care
arată doar avertismentele și erorile.
