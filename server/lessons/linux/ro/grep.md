Un fișier de log poate avea mii de linii. Rareori ai nevoie de toate — ai nevoie
doar de liniile care menționează un anumit cuvânt. Comanda **grep** ți le găsește.

`grep` caută într-un fișier și afișează **doar liniile care conțin** textul căutat.

Tiparul este: `grep CUVÂNT FIȘIER`.

```bash
grep error system.log
```

```text
error: sensor 3 offline
error: low coolant
```

Fiecare linie care conține `error` este afișată; toate celelalte sunt ascunse.

### Căutarea unei expresii

Dacă textul căutat conține spații, pune-l între ghilimele:

```bash
grep "low coolant" system.log
```

### Când nu se potrivește nimic

Dacă nicio linie nu se potrivește, `grep` pur și simplu nu afișează nimic și te
întoarce la prompt. Nu este o eroare — înseamnă „nu a fost găsit”.

`grep` este unul dintre cele mai puternice instrumente de zi cu zi din Linux. „Unde
este menționat acest cuvânt?” — `grep` îți răspunde instant.

---

## Misiune: Scanare avertismente

Comandantul stației vrea un briefing rapid cu toate avertismentele înregistrate în
această tură. Jurnalul de evenimente se află în `system.log`.

Folosește `grep` pentru a afișa doar liniile care conțin cuvântul `warning`.

**Rezultat așteptat**

În terminal apar doar liniile cu avertismente din `system.log`.
