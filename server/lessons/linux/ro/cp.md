Uneori ai nevoie de o **copie** a unui fișier — un backup, sau un punct de pornire
pentru ceva nou. Comanda **cp** (**copy**) face exact asta.

Tiparul este întotdeauna: `cp SURSĂ DESTINAȚIE`.

```bash
cp misiune.txt misiune-backup.txt
```

Astfel se creează un al doilea fișier, `misiune-backup.txt`, cu același conținut.
Originalul rămâne neatins.

### Copierea într-un folder

Dacă destinația este un folder existent, copia își păstrează numele original și
ajunge în interiorul acelui folder:

```bash
cp misiune.txt backups
```

Astfel se creează `backups/misiune.txt`.

### Copierea unui folder întreg: `cp -r`

Un `cp` simplu refuză să copieze un director:

```bash
cp rapoarte rapoarte-backup
```

```text
cp: -r not specified; omitting directory 'rapoarte'
```

Opțiunea `-r` (**recursive**) copiază folderul _și tot ce se află în el_:

```bash
cp -r rapoarte rapoarte-backup
```

Acum `rapoarte-backup` este o copie completă a lui `rapoarte`.

### O notă de prudență

Dacă fișierul destinație există deja, `cp` îl **suprascrie** fără să întrebe. Alege-ți
cu grijă numele destinațiilor.

---

## Misiune: Backup de urgență

A fost emisă o avertizare de furtună solară. Datele critice ale stației trebuie salvate imediat, înainte să apară vreo defecțiune.

1. Fă o copie de siguranță a fișierului `misiune.txt` numită `misiune-backup.txt`.
2. Copiază întregul folder `rapoarte` într-un folder nou numit `rapoarte-backup`.

**Rezultat așteptat**

Directorul tău home conține acum atât `misiune-backup.txt`, cât și un folder `rapoarte-backup` cu același conținut ca `rapoarte`.
