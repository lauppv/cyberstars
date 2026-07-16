Un fișier de log poate avea mii de linii. Rareori ai nevoie de toate — ai nevoie
doar de liniile care menționează un anumit cuvânt. Comanda **grep** ți le găsește.

`grep` caută într-un fișier și afișează **doar liniile care conțin** textul căutat.

Tiparul este: `grep CUVÂNT FIȘIER`.

```bash
grep error sistem.log
```

```text
error: sensor 3 offline
error: low coolant
```

Fiecare linie care conține `error` este afișată; toate celelalte sunt ascunse.

### Căutarea unei expresii

Dacă textul căutat conține spații, pune-l între ghilimele:

```bash
grep "low coolant" sistem.log
```

### Când nu se potrivește nimic

Dacă nicio linie nu se potrivește, `grep` pur și simplu nu afișează nimic și te
întoarce la prompt. Nu este o eroare — înseamnă „nu a fost găsit”.

`grep` este unul dintre cele mai puternice instrumente de zi cu zi din Linux. „Unde
este menționat acest cuvânt?” — `grep` îți răspunde instant.

---

## Misiune: Scanare avertismente

Comandantul stației vrea un briefing rapid cu avertismentele înregistrate în această
tură și o copie a jurnalului la dosar. Jurnalul de evenimente se află în `sistem.log`.

1. Afișează doar liniile care conțin cuvântul `warning`.
2. Fă o a doua căutare pentru liniile care conțin `error`.
3. Creează un folder numit `scanare` și copiază `sistem.log` în el sub numele
   `tura.log` pentru evidență.

**Rezultat așteptat**

Apar liniile de avertisment, apoi linia de eroare, iar folderul `scanare` conține o
copie a jurnalului turei.
