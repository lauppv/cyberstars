Până acum, fiecare comandă și-a afișat rezultatul pe ecran. Dar ce faci când trebuie să
salvezi acel rezultat? Operatorul **`>`** trimite (redirecționează) ieșirea unei comenzi
**într-un fișier**, în loc să o afișeze.

Tiparul este: `COMANDĂ > FIȘIER`.

```bash
echo "Reactor online" > status.txt
```

```text

```

Nu a apărut nimic pe ecran — textul a ajuns în `status.txt`. Poți verifica cu `cat`:

```bash
cat status.txt
```

```text
Reactor online
```

### Atenție: `>` suprascrie!

Dacă fișierul există deja, `>` îi **înlocuiește** complet conținutul. Gândește-te la el
ca la „creează sau suprascrie".

```bash
echo "Reactor offline" > status.txt
cat status.txt
```

```text
Reactor offline
```

Conținutul vechi a dispărut. Când vrei să păstrezi ce era deja acolo, vei folosi `>>`
(lecția următoare).

Orice comandă care produce ieșire poate fi redirecționată — `ls`, `grep`, `cat`, `date`,
orice.

---

## Misiune: Extragerea alertelor critice

Rețeaua de senzori a înregistrat citiri în `senzori.log`, dar inginerul-șef vrea să vadă doar avertismentele critice. Extrage-le într-un fișier separat, ca echipa de reparații să știe exact ce trebuie remediat.

Folosește `grep` ca să găsești liniile care conțin `critical` în `senzori.log` și redirecționează rezultatul într-un fișier nou numit `alerte.txt`.

**Rezultat așteptat**

Rulând `cat alerte.txt`, vei vedea doar cele două linii critice din jurnalul senzorilor.
