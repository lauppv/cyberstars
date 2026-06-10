Acum că știi **unde** te afli folosind `pwd`, următoarea întrebare este: **ce se
găsește aici?**

Comanda **ls** (prescurtare de la **list**) îți arată fișierele și folderele din
directorul tău curent.

```bash
ls
```

Dacă folderul conține câteva elemente, ar putea afișa:

```text
mission.txt  reports  tools
```

Fiecare nume este fie un **fișier** (precum `mission.txt`), fie un **folder /
director** (precum `reports` și `tools`). Cu simpla comandă `ls`, ele pot părea
identice — într-o lecție viitoare vei învăța cum să le deosebești dintr-o privire.

Poți lista și conținutul unui folder **fără a intra în el**, dându-i numele lui `ls`:

```bash
ls reports
```

```text
january.log  february.log
```

Astfel arunci o privire înăuntrul lui `reports` în timp ce rămâi pe loc.

La fel ca `pwd`, `ls` doar _privește_ — nu modifică și nu șterge nimic. Îl poți
rula oricând te simți pierdut.

Un obicei util: rulează `ls` ori de câte ori ajungi într-un director nou, ca să știi
mereu cu ce lucrezi.

---

## Misiune: Inventar

Echipajul anterior a lăsat în urmă fișiere și foldere în directorul tău personal. Înainte de a-ți începe tura, trebuie să știi cu ce ai de-a face.

Rulează `ls` pentru a lista tot ce se află în directorul curent.

**Rezultat așteptat**

Terminalul afișează numele tuturor fișierelor și folderelor lăsate de echipajul anterior.
