Comanda **sort** rearanjează liniile unui text în ordine. Implicit, sortează
alfabetic (A înaintea lui B, iar literele mici după cele mari).

```bash
sort crew.txt
```

```text
Chen
Okafor
Tanaka
Voss
```

Fișierul original rămâne neschimbat — `sort` afișează rezultatul sortat la stdout. Îl poți
salva cu `> sorted.txt` dacă e nevoie.

### Ordine inversă cu `-r`

```bash
sort -r crew.txt
```

```text
Voss
Tanaka
Okafor
Chen
```

### Sortarea ține cont implicit de literele mari și mici

Literele mari sunt sortate înaintea celor mici. Dacă vrei o sortare alfabetică reală,
indiferent de caz, adaugă `-f` (fold case):

```bash
sort -f mixed.txt
```

### Sort într-un pipeline

`sort` se integrează perfect într-un pipeline — citește din stdin dacă nu i se dă fișier:

```bash
grep "error" log.txt | sort
```

Această comandă filtrează mai întâi erorile, apoi le sortează alfabetic.

---

## Misiune: Lista de priorități pentru cargo

O navetă de aprovizionare tocmai a andocat, iar manifestul din cala de marfă (`supplies.txt`) este în dezordine. Ofițerul cu logistica vrea ca articolele să fie listate în ordine alfabetică inversă pentru echipa de descărcare.

Sortează `supplies.txt` în **ordine alfabetică inversă** și afișează rezultatul pe ecran.

**Rezultat așteptat**

Cele șase articole apar de la `water filters` până la `ammo crates`.
