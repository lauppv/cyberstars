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
identice. Într-o lecție viitoare vei învăța cum să le deosebești dintr-o privire.

Poți lista și conținutul unui folder **fără a intra în el**, dându-i numele lui `ls`:

```bash
ls rapoarte
```

```text
ianuarie.log  februarie.log
```

Astfel arunci o privire înăuntrul lui `rapoarte` în timp ce rămâi pe loc.

La fel ca `pwd`, `ls` doar _privește_. Nu modifică și nu șterge nimic. Îl poți
rula oricând te simți pierdut.

Un obicei util: rulează `ls` ori de câte ori ajungi într-un director nou, ca să știi
mereu cu ce lucrezi.

---

## Misiune: Inventar

Echipajul anterior a lăsat fișiere și foldere în directorul tău personal, iar unul dintre foldere păstrează jurnalele lor de raport. Înainte să-ți înceapă tura, află ce au lăsat în urmă și ce luni acoperă rapoartele lor. Rămâi tot timpul în directorul tău personal.

**Rezultat așteptat**

Poți numi tot ce se află în directorul tău personal și fiecare jurnal de raport, fără să fi plecat de acasă.
