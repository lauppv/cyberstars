Comanda **sort** rearanjează liniile unui text în ordine. Implicit, sortează
alfabetic (A înaintea lui B, iar literele mici după cele mari).

```bash
sort echipaj.txt
```

```text
Chen
Okafor
Tanaka
Voss
```

Fișierul original rămâne neschimbat: `sort` afișează rezultatul sortat la stdout. Îl poți
salva cu `> sortat.txt` dacă e nevoie.

### Ordine inversă cu `-r`

```bash
sort -r echipaj.txt
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
sort -f amestecat.txt
```

### Sort într-un pipeline

`sort` se integrează perfect într-un pipeline: citește din stdin dacă nu i se dă fișier:

```bash
grep "error" jurnal.txt | sort
```

Această comandă filtrează mai întâi erorile, apoi le sortează alfabetic.

---

## Misiune: Lista de Prioritate a Mărfii

O navetă de aprovizionare tocmai a andocat, iar manifestul de marfă `provizii.txt` e harababură. Regula intendentului: se descarcă în ordine alfabetică inversă. Într-un folder nou `cala-marfa`, salvează toată lista în ordinea asta ca `ordine-descarcare.txt`, iar obiectul pe care echipajul îl descarcă primul, singur, ca `primul.txt`.

**Rezultat așteptat**

`cala-marfa/ordine-descarcare.txt` ține toate obiectele de la ultimul la primul din alfabet, iar `cala-marfa/primul.txt` ține doar pe cel din vârf.
