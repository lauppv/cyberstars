Până acum, `grep` a căutat într-**un singur fișier**. Dar ce te faci dacă nu știi
_în care_ fișier se află cuvântul — știi doar că este undeva într-un folder plin de
fișiere și sub-foldere?

Opțiunea `-r` (**recursivă**) îi spune lui `grep` să caute în **fiecare fișier
dintr-un întreg arbore de directoare**.

```bash
grep -r "sector 7" jurnale
```

```text
jurnale/ianuarie.log:Misiune spre sectorul 7 aprobata.
jurnale/vechi/arhiva.log:Recunoastere sector 7 finalizata.
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
grep -ri "error" jurnale     # recursiva + insensibila la majuscule
grep -rn "error" jurnale     # recursiva + cu numere de linie
```

`grep -r` este modul în care răspunzi la întrebarea „este menționat acest cuvânt
_undeva_ în proiectul meu?”.

---

## Misiune: Investigarea defecțiunilor

A fost raportată o defecțiune recurentă, iar echipa de mentenanță are nevoie de
fiecare apariție a cuvântului `failure` din jurnalele stației, plus fișierul vinovat
scos deoparte ca dovadă. Folderul `jurnale` conține fișiere răspândite în mai multe
sub-foldere.

1. Caută recursiv `failure` peste tot sub folderul `jurnale` — fiecare rezultat arată
   din ce fișier provine.
2. Creează un folder numit `investigatie` și copiază jurnalul din ianuarie
   `jurnale/ianuarie.log`, care conține defecțiunea pompei de răcire, în el sub numele
   `dovada.log`.
3. Afișează fișierul-dovadă ca să confirmi că a captat linia cu defecțiunea.

**Rezultat așteptat**

Fiecare linie cu `failure` apare cu calea fișierului ei, iar folderul `investigatie`
conține o copie a jurnalului din ianuarie sub numele `dovada.log`.
