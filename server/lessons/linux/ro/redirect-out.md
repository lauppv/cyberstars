Până acum, fiecare comandă și-a afișat rezultatul pe ecran. Dar ce faci când trebuie să
salvezi acel rezultat? Operatorul **`>`** trimite (redirecționează) ieșirea unei comenzi
**într-un fișier**, în loc să o afișeze.

Tiparul este: `COMANDĂ > FIȘIER`.

```bash
echo "Reactor online" > stare.txt
```

```text

```

Nu a apărut nimic pe ecran — textul a ajuns în `stare.txt`. Poți verifica cu `cat`:

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

Orice comandă care produce ieșire poate fi redirecționată — `ls`, `grep`, `cat`, `date`,
orice.

---

## Misiune: Extragerea alertelor critice

Rețeaua de senzori a înregistrat citiri în `senzori.log`, dar inginerul-șef vrea liniile importante separate în fișiere proprii, ca echipa de reparații să știe exact ce trebuie remediat.

1. Găsește liniile care conțin `critical` în `senzori.log` și salvează acel rezultat într-un fișier nou numit `alerte.txt`, în loc să-l afișezi pe ecran.
2. Fă la fel pentru citirile sănătoase: capturează liniile care conțin `ok` într-un fișier numit `sanatoase.txt`.
3. Creează un folder numit `raport` și mută ambele fișiere în el.
4. Afișează `raport/alerte.txt` ca să confirmi că lista echipei de reparații este corectă.

**Rezultat așteptat**

Folderul `raport` conține `alerte.txt` (cele două linii critice) și `sanatoase.txt` (cele trei citiri sănătoase).
