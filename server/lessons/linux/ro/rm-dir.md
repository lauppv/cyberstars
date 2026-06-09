Ștergerea **folderelor** necesită puțin mai multă grijă decât ștergerea fișierelor.
Ai două unelte la dispoziție.

### Foldere goale: `rmdir`

Comanda **rmdir** (**remove directory**) șterge un folder — dar **doar dacă este
gol**:

```bash
rmdir old-folder
```

Dacă folderul mai conține ceva, `rmdir` refuză:

```bash
rmdir reports
```

```text
rmdir: failed to remove 'reports': Directory not empty
```

Acest refuz este o **măsură de siguranță** — te împiedică să ștergi fișiere din
greșeală.

### Foldere cu conținut: `rm -r`

Pentru a șterge un folder _și tot ce se află în el_, folosește `rm` cu opțiunea `-r`
(**recursive**):

```bash
rm -r reports
```

Astfel se șterge `reports`, fiecare fișier din el, fiecare subfolder și conținutul
lor — totul permanent.

### Manevrează cu grijă

`rm -r` este puternic și periculos. Șterge arbori întregi fără confirmare și fără
posibilitate de recuperare. Întotdeauna rulează `ls` pe folder mai întâi, ca să fii
sigur ce conține.

| Comandă | Folosește-o pentru                            |
| ------- | --------------------------------------------- |
| `rmdir` | un folder **gol** (sigur)                     |
| `rm -r` | un folder **cu conținut** (puternic, atenție!) |

---

## Misiune: Dezafectează vechile compartimente

Două compartimente de depozitare ale stației sunt programate pentru dezafectare. Folderul `empty-bay` a fost deja golit, dar `old-data` mai conține fișiere reziduale.

1. Șterge folderul gol `empty-bay` folosind `rmdir`.
2. Șterge folderul `old-data` și tot conținutul său folosind `rm -r`.

**Rezultat așteptat**

Ambele foldere au dispărut, dar folderul `mission` rămâne neatins.
