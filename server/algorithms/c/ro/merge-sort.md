# Hard · Merge Sort

Citește un întreg **N**, apoi citește **N** numere întregi. Sortează-le folosind algoritmul de **sortare prin interclasare** și afișează rezultatul sortat.

Sortarea prin interclasare este un algoritm de tip „divide și stăpânește”: împarte tabloul în jumătate, sortează recursiv fiecare jumătate, apoi interclasează cele două jumătăți sortate. Se execută în timp O(N log N).

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 1000)
- A doua linie: `N` numere întregi separate prin spații

### Rezultat

Cele `N` numere întregi sortate crescător, separate prin spații, pe o singură linie.

### Exemple

```
Intrare:
5
38 27 43 3 9
Ieșire: 3 9 27 38 43
```

```
Intrare:
4
4 3 2 1
Ieșire: 1 2 3 4
```

### Indicii

- Scrie o funcție `merge` care interclasează două subtablouri sortate într-unul singur.
- Scrie o funcție `mergeSort` care împarte și interclasează recursiv.
- Vei avea nevoie de un tablou temporar pentru interclasare — îl poți aloca cu `malloc` sau poți folosi un tablou global/local.
- Caz de bază: un tablou de dimensiune 0 sau 1 este deja sortat.
