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

- **r** (read) — vezi conținutul fișierului.
- **w** (write) — modifici sau ștergi fișierul.
- **x** (execute) — rulezi fișierul ca program/script.

Pentru directoare: `r` = listezi conținutul, `w` = adaugi/ștergi fișiere, `x` = intri în el (`cd`).

---

## Misiune: Audit de securitate

Comandantul stației a ordonat un audit al permisiunilor pe stația ta de lucru și vrea o evidență scrisă arhivată.

1. Afișează detaliile complete ale permisiunilor pentru fiecare fișier din directorul tău home.
2. Salvează acea listare detaliată într-un fișier nou numit `audit.txt`.
3. Creează un folder numit `raport-audit` și mută `audit.txt` în el.
4. Numără câte linii conține auditul salvat.

**Rezultat așteptat**

`raport-audit/audit.txt` conține listarea permisiunilor pentru fiecare fișier din directorul tău home.
