Până acum, `grep` a căutat într-**un singur fișier**. Dar ce te faci dacă nu știi
_în care_ fișier se află cuvântul — știi doar că este undeva într-un folder plin de
fișiere și sub-foldere?

Opțiunea `-r` (**recursivă**) îi spune lui `grep` să caute în **fiecare fișier
dintr-un întreg arbore de directoare**.

```bash
grep -r "sector 7" logs
```

```text
logs/january.log:Mission to sector 7 approved.
logs/old/archive.log:Sector 7 survey complete.
```

Observă că ieșirea începe acum cu **numele fișierului** pentru fiecare potrivire,
apoi două puncte, apoi linia care s-a potrivit. Astfel știi _de unde_ provine
fiecare rezultat.

### Căutarea din folderul curent

Un singur punct `.` înseamnă „directorul curent”. Ca să cauți peste tot sub locul
unde te afli:

```bash
grep -r "error" .
```

### Combinarea cu alte opțiuni

Căutarea recursivă funcționează împreună cu opțiunile pe care le știi deja:

```bash
grep -ri "error" logs     # recursivă + insensibilă la majuscule
grep -rn "error" logs     # recursivă + cu numere de linie
```

`grep -r` este modul în care răspunzi la întrebarea „este menționat acest cuvânt
_undeva_ în proiectul meu?”.

---

## Misiune: Investigarea defecțiunilor

A fost raportată o defecțiune recurentă, iar echipa de mentenanță are nevoie de
fiecare apariție a cuvântului `failure` din jurnalele stației. Folderul `logs`
conține fișiere răspândite în mai multe sub-foldere.

Folosește `grep -r` pentru a căuta `failure` în întregul director `logs`.

**Rezultat așteptat**

Fiecare potrivire afișează calea fișierului, două puncte și linia care conține
`failure`.
