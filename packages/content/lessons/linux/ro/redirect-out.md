Până acum, fiecare comandă și-a afișat rezultatul pe ecran. Dar ce faci când trebuie să
salvezi acel rezultat? Operatorul **`>`** trimite (redirecționează) ieșirea unei comenzi
**într-un fișier**, în loc să o afișeze.

Tiparul este: `COMANDĂ > FIȘIER`.

```bash
echo "Reactor online" > stare.txt
```

```text

```

Nu a apărut nimic pe ecran: textul a ajuns în `stare.txt`. Poți verifica cu `cat`:

```bash
cat stare.txt
```

```text
Reactor online
```

### Atenție: `>` suprascrie!

Dacă fișierul există deja, `>` îi **înlocuiește** complet conținutul. Gândește-te la el
ca la „creează sau suprascrie".

```bash
echo "Reactor offline" > stare.txt
cat stare.txt
```

```text
Reactor offline
```

Conținutul vechi a dispărut. Când vrei să păstrezi ce era deja acolo, vei folosi `>>`
(lecția următoare).

Orice comandă care produce ieșire poate fi redirecționată: `ls`, `grep`, `cat`, `date`,
orice.

---

## Misiune: Extragerea Alertelor Critice

Rețeaua de senzori își scrie citirile în `senzori.log`. Inginerul-șef le vrea împărțite într-un folder `raport`: `alerte.txt` cu fiecare citire `critical` pentru echipa de reparații și `sanatoase.txt` cu fiecare citire `ok`. Ambele fișiere vin direct din jurnal, nu scrise de mână.

**Rezultat așteptat**

`raport/alerte.txt` ține doar citirile critice, iar `raport/sanatoase.txt` doar pe cele sănătoase, în ordinea din jurnal.
