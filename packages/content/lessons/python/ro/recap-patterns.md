Combină **funcțiile built-in**, **descompunerea problemei** și tiparele **counter**, **accumulator** și **flag**

---

## Misiune: Analizatorul Jurnalului de Misiune

Jurnalul de misiune este un singur șir de cuvinte despărțite prin spații, păstrat într-o variabilă numită `jurnal`. **Împarte munca în trei funcții**, fiecare folosind un alt tipar:

1. `contor_cuvant(jurnal, cuvant)`: **tiparul counter**: de câte ori apare `cuvant` în jurnal
2. `cel_mai_lung_cuvant(jurnal)`: **tiparul accumulator**: cel mai lung cuvânt din jurnal (primul, dacă mai multe sunt la fel de lungi)
3. `are_duplicate(jurnal)`: **tiparul flag**: întoarce `True` dacă vreun cuvânt apare de mai multe ori

În programul principal, folosește și **funcții built-in**: `len()` pentru numărul total de cuvinte și `sorted()` împreună cu un `set()` pentru cuvintele unice. Afișează:

- `Total cuvinte: ` apoi câte cuvinte sunt
- `Aparitii citire: ` apoi de câte ori apare `citire`
- `Cel mai lung cuvant: ` apoi cel mai lung cuvânt
- `Are duplicat: ` apoi `True` sau `False`
- `Cuvinte unice: ` apoi lista sortată de cuvinte unice

**Ieșire**

```text
Total cuvinte: 7
Aparitii citire: 3
Cel mai lung cuvant: analiza
Are duplicat: True
Cuvinte unice: ['analiza', 'citire', 'sonda', 'start']
```
