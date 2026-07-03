Folderele au nevoie de **fișiere** în interiorul lor. Cea mai rapidă cale de a crea
un fișier nou, gol, este comanda **touch**.

```bash
touch notes.txt
```

Din nou, succesul este tăcut. Confirmă cu `ls`:

```bash
ls
```

```text
notes.txt
```

Fișierul există, dar este complet gol (0 octeți) până când pui ceva în el.

### Mai multe fișiere simultan

La fel ca `mkdir`, `touch` acceptă mai multe nume:

```bash
touch log1.txt log2.txt log3.txt
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

Comandantul stației are nevoie de trei fișiere noi pentru briefing-ul de astăzi. Directorul tău home are deja pregătit un folder `rapoarte`.

1. Creează un fișier gol numit `misiune.txt`.
2. Creează un fișier gol numit `echipaj.txt`.
3. Creează un fișier gol numit `rezumat.txt` **în interiorul** folderului `rapoarte`.

**Rezultat așteptat**

Rulând `ls` în directorul tău home apar `misiune.txt` și `echipaj.txt`, iar rulând `ls rapoarte` apare `rezumat.txt`.
