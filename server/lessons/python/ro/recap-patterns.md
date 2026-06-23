Combină **funcțiile built-in**, **descompunerea problemei** și tiparele **counter**, **accumulator** și **flag**

---

## Misiune: Analizatorul Jurnalului de Misiune

Jurnalul de misiune este un singur șir de cuvinte (deja în dreapta). **Împarte munca în trei funcții**, fiecare folosind un alt tipar:

1. `contor_cuvant(log, cuvant)` — **tiparul counter**: de câte ori apare `cuvant` în jurnal
2. `cel_mai_lung_cuvant(log)` — **tiparul accumulator**: cel mai lung cuvânt din jurnal
3. `has_duplicate(log)` — **tiparul flag**: întoarce `True` dacă vreun cuvânt apare de mai multe ori

În programul principal, folosește și **funcții built-in** — `len()` pentru numărul total de cuvinte și `sorted()` împreună cu un `set()` pentru cuvintele unice. Afișează:

- `Total cuvinte: ` apoi câte cuvinte sunt
- `Apariții scan: ` apoi de câte ori apare `scan`
- `Cel mai lung cuvânt: ` apoi cel mai lung cuvânt
- `Are duplicat: ` apoi `True` sau `False`
- `Cuvinte unice: ` apoi lista sortată de cuvinte unice

**Ieșire**

```text
Total cuvinte: 7
Aparitii scan: 3
Cel mai lung cuvant: analyze
Are duplicat: True
Cuvinte unice: ['analyze', 'boot', 'probe', 'scan']
```
