Când un fișier nu mai este necesar, comanda **rm** (**remove**) îl șterge.

```bash
rm old-notes.txt
```

Fișierul dispare imediat. Rulează `ls` pentru a confirma că a dispărut.

### O avertizare serioasă

**Nu există coș de gunoi** în terminal. `rm` nu mută fișierele la coș — le
**distruge permanent**. Nu există „undo".

Așa că, înainte să apeși Enter, citește-ți întotdeauna comanda de două ori. Un obicei
bun este să rulezi `ls` mai întâi și să te asiguri că ștergi exact ceea ce vrei.

### Ștergerea mai multor fișiere

`rm` acceptă mai multe nume:

```bash
rm log1.txt log2.txt log3.txt
```

### Întrebare înainte de fiecare ștergere: `rm -i`

Opțiunea `-i` (**interactive**) îl face pe `rm` să ceară confirmare înainte să șteargă
fiecare fișier:

```bash
rm -i important.txt
```

```text
rm: remove regular file 'important.txt'?
```

Tastezi `y` pentru a confirma sau `n` pentru a anula. Pentru începători, `rm -i`
este un obicei sigur atunci când ștergi ceva de care nu ești sigur.

---

## Misiune: Curăță datele inutile

Un scan de mentenanță de rutină a detectat fișiere reziduale care aglomerează spațiul de lucru al stației. Trebuie eliminate, dar ai grijă să nu ștergi ceva important.

1. Șterge fișierul `junk.txt`.
2. Șterge fișierul `temp.log`.

**Rezultat așteptat**

Ambele fișiere inutile au dispărut, dar `mission.txt` rămâne în siguranță în directorul tău home.
