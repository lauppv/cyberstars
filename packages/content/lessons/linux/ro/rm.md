Când un fișier nu mai este necesar, comanda **rm** (**remove**) îl șterge.

```bash
rm old-notite.txt
```

Fișierul dispare imediat. Rulează `ls` pentru a confirma că a dispărut.

### O avertizare serioasă

**Nu există coș de gunoi** în terminal. `rm` nu mută fișierele la coș, ci le
**distruge permanent**. Nu există „undo".

Așa că, înainte să apeși Enter, citește-ți întotdeauna comanda de două ori. Un obicei
bun este să rulezi `ls` mai întâi și să te asiguri că ștergi exact ceea ce vrei.

### Ștergerea mai multor fișiere

`rm` acceptă mai multe nume:

```bash
rm jurnal1.txt jurnal2.txt jurnal3.txt
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

## Misiune: Curăță Datele Inutile

O scanare de mentenanță a găsit fișiere inutile în directorul tău personal. Contează doar fișierul misiunii, iar ștergerea nu are „undo”, așa că pune întâi o copie a lui într-un folder nou `pastreaza`. Apoi scapă de toate celelalte fișiere din directorul tău personal.

**Rezultat așteptat**

Directorul tău personal ține fișierul misiunii și `pastreaza` cu copia lui, nimic altceva.
