Ștergerea folderelor necesită puțin mai multă grijă decât ștergerea fișierelor.
Ai două unelte la dispoziție.

### Foldere goale: `rmdir`

Comanda **rmdir** (**remove directory**) șterge un folder, dar **doar dacă este
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

Acest refuz este o măsură de siguranță: te împiedică să ștergi fișiere din
greșeală.

### Foldere cu conținut: `rm -r`

Pentru a șterge un folder _și tot ce se află în el_, folosește `rm` cu opțiunea `-r`
(**recursive**):

```bash
rm -r rapoarte
```

Astfel se șterge `rapoarte`, fiecare fișier din el, fiecare subfolder și conținutul
lor, totul permanent.

### Manevrează cu grijă

`rm -r` este puternic și periculos. Șterge arbori întregi fără confirmare și fără
posibilitate de recuperare. Întotdeauna rulează `ls` pe folder mai întâi, ca să fii
sigur ce conține.

| Comandă | Folosește-o pentru                         |
| ------- | ------------------------------------------ |
| `rmdir` | un folder gol (sigur)                      |
| `rm -r` | un folder cu conținut (puternic, atenție!) |

---

## Misiune: Dezafectează Compartimentele Vechi

Două compartimente de depozitare se dezafectează: `compartiment-gol`, golit deja, și `date-vechi`, care mai ține jurnale rămase. Uită-te ce e acolo înainte să ștergi ceva.

1. Jurnalul `a.log` din `date-vechi` trebuie să supraviețuiască: păstrează o copie a lui într-un folder nou `arhiva`.
2. Șterge compartimentul gol cu comanda care refuză să șteargă un folder în care mai e ceva, ca o greșeală să nu coste date.
3. Șterge `date-vechi` cu tot ce mai e în el.

**Rezultat așteptat**

Ambele compartimente au dispărut, `a.log` supraviețuiește în `arhiva`, iar folderul `misiune` e neatins.
