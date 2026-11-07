Un fișier de log poate avea mii de linii. Rareori ai nevoie de toate. Ai nevoie
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
întoarce la prompt. Nu este o eroare. Înseamnă „nu a fost găsit”.

`grep` este unul dintre cele mai puternice instrumente de zi cu zi din Linux. „Unde
este menționat acest cuvânt?” `grep` îți răspunde instant.

---

## Misiune: Scanarea Avertismentelor

Comandantul stației vrea un raport rapid din jurnalul de evenimente al turei, `sistem.log`: fiecare linie care e un `warning` și, într-o a doua căutare, tot ce spune jurnalul despre senzori (`sensor`). Păstrează o copie a jurnalului pentru registru ca `scanare/tura.log`.

**Rezultat așteptat**

Vezi doar liniile de avertisment, apoi doar liniile despre senzori, iar copia din `scanare` spune ce spune originalul.
