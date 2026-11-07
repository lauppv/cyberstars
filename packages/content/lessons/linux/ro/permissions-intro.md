Fiecare fișier din Linux are **permisiuni** care controlează cine îl poate citi, modifica sau executa.
Rulează `ls -l` și uită-te la prima coloană:

```bash
ls -l
```

```text
-rwxr-xr-- 1 student echipaj  4096 Jan 10 08:00 lanseaza.sh
-rw-r--r-- 1 student echipaj  2048 Jan 10 08:00 config.txt
drwxr-x--- 2 student echipaj  4096 Jan 10 08:00 jurnale
```

Șirul de permisiuni are 10 caractere. Primul indică tipul (`-` = fișier, `d` =
director). Restul de 9 sunt împărțite în trei grupuri de câte trei:

| Poziții | Cine                  | Semnificație                           |
| ------- | --------------------- | -------------------------------------- |
| 2-4     | **u**ser (proprietar) | `rwx` = citire, scriere, execuție      |
| 5-7     | **g**rup              | `r-x` = citire, fără scriere, execuție |
| 8-10    | **o**thers (ceilalți) | `r--` = doar citire                    |

O liniuță (`-`) înseamnă că permisiunea respectivă **nu** este acordată.

### Ce înseamnă r, w, x?

- **r** (read): vezi conținutul fișierului.
- **w** (write): modifici sau ștergi fișierul.
- **x** (execute): rulezi fișierul ca program/script.

Pentru directoare: `r` = listezi conținutul, `w` = adaugi/ștergi fișiere, `x` = intri în el (`cd`).

---

## Misiune: Auditul de Securitate

Comandantul stației a ordonat un audit al permisiunilor pe stația ta de lucru. Păstrează raportul ca `raport-audit/audit.txt`: pentru fiecare fișier din directorul tău personal, tipul, permisiunile, proprietarul și mărimea lui, direct din sistem, nu scrise de mână.

**Rezultat așteptat**

`raport-audit/audit.txt` listează fiecare fișier din directorul tău personal cu șirul lui de permisiuni, proprietarul și mărimea.
