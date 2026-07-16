Ștergerea **folderelor** necesită puțin mai multă grijă decât ștergerea fișierelor.
Ai două unelte la dispoziție.

### Foldere goale: `rmdir`

Comanda **rmdir** (**remove directory**) șterge un folder — dar **doar dacă este
gol**:

```bash
rmdir folder-vechi
```

Dacă folderul mai conține ceva, `rmdir` refuză:

```bash
rmdir rapoarte
```

```text
rmdir: failed to remove 'rapoarte': Directory not empty
```

Acest refuz este o **măsură de siguranță** — te împiedică să ștergi fișiere din
greșeală.

### Foldere cu conținut: `rm -r`

Pentru a șterge un folder _și tot ce se află în el_, folosește `rm` cu opțiunea `-r`
(**recursive**):

```bash
rm -r rapoarte
```

Astfel se șterge `rapoarte`, fiecare fișier din el, fiecare subfolder și conținutul
lor — totul permanent.

### Manevrează cu grijă

`rm -r` este puternic și periculos. Șterge arbori întregi fără confirmare și fără
posibilitate de recuperare. Întotdeauna rulează `ls` pe folder mai întâi, ca să fii
sigur ce conține.

| Comandă | Folosește-o pentru                             |
| ------- | ---------------------------------------------- |
| `rmdir` | un folder **gol** (sigur)                      |
| `rm -r` | un folder **cu conținut** (puternic, atenție!) |

---

## Misiune: Dezafectează vechile compartimente

Două compartimente de depozitare ale stației sunt programate pentru dezafectare. Folderul `compartiment-gol` a fost deja golit, dar `date-vechi` mai conține fișiere reziduale — iar unul dintre ele, `a.log`, trebuie păstrat înainte ca acel compartiment să fie șters.

1. Inspectează spațiul de lucru, apoi uită-te în interiorul lui `date-vechi`, ca să vezi exact ce e acolo înainte să ștergi ceva.
2. Creează un folder `arhiva` și copiază `date-vechi/a.log` în el ca backup de siguranță.
3. Șterge folderul gol `compartiment-gol` — metoda sigură, care funcționează doar pe foldere goale.
4. Șterge folderul `date-vechi` și tot ce se află în el.

**Rezultat așteptat**

Ambele compartimente au dispărut, `a.log` supraviețuiește în `arhiva`, iar folderul `misiune` rămâne neatins.
