Acum că știi **unde** te afli folosind `pwd`, următoarea întrebare este: **ce se
găsește aici?**

Comanda **ls** (prescurtare de la **list**) îți arată fișierele și folderele din
directorul tău curent.

```bash
ls
```

Dacă folderul conține câteva elemente, ar putea afișa:

```text
misiune.txt  rapoarte  unelte
```

Fiecare nume este fie un **fișier** (precum `misiune.txt`), fie un **folder /
director** (precum `rapoarte` și `unelte`). Cu simpla comandă `ls`, ele pot părea
identice — într-o lecție viitoare vei învăța cum să le deosebești dintr-o privire.

Poți lista și conținutul unui folder **fără a intra în el**, dându-i numele lui `ls`:

```bash
ls rapoarte
```

```text
ianuarie.log  februarie.log
```

Astfel arunci o privire înăuntrul lui `rapoarte` în timp ce rămâi pe loc.

La fel ca `pwd`, `ls` doar _privește_ — nu modifică și nu șterge nimic. Îl poți
rula oricând te simți pierdut.

Un obicei util: rulează `ls` ori de câte ori ajungi într-un director nou, ca să știi
mereu cu ce lucrezi.

---

## Misiune: Inventar

Echipajul anterior a lăsat în urmă fișiere și foldere în directorul tău personal, iar unul dintre acele foldere păstrează rapoartele lor vechi. Înainte de a-ți începe tura, trebuie să știi cu ce ai de-a face.

1. Confirmă unde te afli în sistemul de fișiere.
2. Listează tot ce se află în directorul curent ca să vezi ce a lăsat echipajul anterior.
3. Aruncă o privire în folderul `rapoarte` fără a intra în el.

**Rezultat așteptat**

Confirmi că ești în `/home/student`, listarea scoate la iveală ce a lăsat echipajul anterior, iar privirea în `rapoarte` afișează jurnalele de raport din acel folder.
