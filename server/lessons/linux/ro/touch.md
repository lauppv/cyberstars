Folderele au nevoie de **fișiere** în interiorul lor. Cea mai rapidă cale de a crea
un fișier nou, gol, este comanda **touch**.

```bash
touch notite.txt
```

Din nou, succesul este tăcut. Confirmă cu `ls`:

```bash
ls
```

```text
notite.txt
```

Fișierul există, dar este complet gol (0 octeți) până când pui ceva în el.

### Mai multe fișiere simultan

La fel ca `mkdir`, `touch` acceptă mai multe nume:

```bash
touch jurnal1.txt jurnal2.txt jurnal3.txt
```

### Crearea unui fișier într-un folder

Dacă folderul există deja, poți face `touch` la un fișier direct în interiorul lui:

```bash
touch rapoarte/rezumat.txt
```

(Folderul trebuie să existe în prealabil — `touch` nu creează foldere.)

### De ce se numește „touch"?

Dacă fișierul _există deja_, `touch` nu îl șterge — doar îi actualizează ora de
„ultimă modificare". Acesta este scopul său original. Pentru un începător, gândește-te
la el pur și simplu ca la **„creează un fișier gol"**.

---

## Misiune: Pregătește fișierele de misiune

Comandantul stației are nevoie de fișiere noi pentru briefing-ul de astăzi, plus un loc proaspăt pentru jurnalele zilnice. Directorul tău home are deja pregătit un folder `rapoarte`.

1. Creează două fișiere goale `misiune.txt` și `echipaj.txt` în directorul home printr-o **singură** comandă.
2. Creează un folder nou `jurnale` în interiorul lui `rapoarte`.
3. Creează două fișiere de jurnal goale în interiorul lui: `rapoarte/jurnale/ziua1.log` și `rapoarte/jurnale/ziua2.log`.
4. Verifică folderul de jurnale ca arbore.

**Rezultat așteptat**

Listarea afișează `misiune.txt` și `echipaj.txt`, iar arborele lui `rapoarte` afișează `ziua1.log` și `ziua2.log` în interiorul lui `rapoarte/jurnale`.
