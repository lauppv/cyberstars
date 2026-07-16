Când un fișier nu mai este necesar, comanda **rm** (**remove**) îl șterge.

```bash
rm old-notite.txt
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

## Misiune: Curăță datele inutile

Un scan de mentenanță de rutină a semnalat reziduuri care aglomerează spațiul de lucru al stației. Înainte de a șterge ceva, pune la adăpost singurul fișier care contează — pentru `rm` nu există „undo".

1. Creează un folder `pastreaza` și copiază `misiune.txt` în el ca backup de siguranță.
2. Inspectează spațiul de lucru înainte de a șterge ceva.
3. Șterge cele trei fișiere inutile `gunoi.txt`, `temp.log` și `cache.tmp` printr-o **singură** comandă.

**Rezultat așteptat**

Fișierele inutile au dispărut, `misiune.txt` rămâne în directorul tău home, iar o copie de siguranță se află în `pastreaza`.
