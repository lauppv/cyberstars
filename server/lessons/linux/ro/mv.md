Comanda **mv** (**move**) îndeplinește două sarcini cu o singură unealtă: **mută**
fișierele într-un alt folder și le **redenumește**. Același tipar ca la `cp`: `mv
SURSĂ DESTINAȚIE`.

### Redenumirea unui fișier

Dacă destinația este pur și simplu un nume nou, fișierul este redenumit pe loc:

```bash
mv ciorna.txt final.txt
```

`ciorna.txt` a dispărut; `final.txt` îi conține acum conținutul. Spre deosebire de
`cp`, nu rămâne nicio copie în plus — `mv` _mută_, nu duplică.

### Mutarea unui fișier într-un folder

Dacă destinația este un folder existent, fișierul este mutat în interiorul lui,
păstrându-și numele:

```bash
mv final.txt rapoarte
```

Acum fișierul se află la `rapoarte/final.txt`.

### Mutare și redenumire dintr-o singură mișcare

Poți face ambele într-o singură comandă — să muți într-un folder _și_ să dai un nume
nou:

```bash
mv notite.txt arhiva/notite-2026.txt
```

### Mutarea folderelor

`mv` gestionează directoarele fără nicio opțiune specială (spre deosebire de `cp`,
care are nevoie de `-r`):

```bash
mv numevechi numenou
```

La fel ca `cp`, `mv` suprascrie un fișier destinație existent fără avertizare, deci
alege-ți numele cu grijă.

---

## Misiune: Relocare de fișiere

Sistemul de arhivare al stației este reorganizat. Un document în lucru trebuie finalizat și mutat în arhivă. Directorul tău home conține `ciorna.txt` și un folder `arhiva`.

1. Redenumește `ciorna.txt` în `raport.txt`.
2. Mută `raport.txt` în folderul `arhiva`.

**Rezultat așteptat**

Fișierul se află acum la `arhiva/raport.txt` și nu mai este în directorul tău home.
