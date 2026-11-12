Folderele au nevoie de fișiere în interiorul lor. Cea mai rapidă cale de a crea
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

(Folderul trebuie să existe în prealabil: `touch` nu creează foldere.)

### De ce se numește „touch"?

Dacă fișierul _există deja_, `touch` nu îl șterge, ci doar îi actualizează ora de
„ultimă modificare". Acesta este scopul său original. Pentru un începător, gândește-te
la el pur și simplu ca la „creează un fișier gol".

---

## Misiune: Pregătește Fișierele Misiunii

Comandantul stației are nevoie de fișiere goale pentru briefing-ul de azi și de un loc pentru jurnalele zilnice în folderul `rapoarte` pe care îl ai deja. Când termini, directorul tău personal trebuie să arate așa, cu toate fișierele goale:

```text
.
├── echipaj.txt
├── misiune.txt
└── rapoarte
    └── jurnale
        ├── ziua1.log
        └── ziua2.log
```

**Rezultat așteptat**

Desenat ca arbore, directorul tău personal arată exact ca planul de mai sus.
