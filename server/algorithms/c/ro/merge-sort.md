# Dificil · Sortare prin interclasare

Citește un întreg **N**, apoi citește **N** numere întregi. Sortează-le folosind algoritmul de **sortare prin interclasare** și afișează rezultatul sortat.

Sortarea prin interclasare este un algoritm de tip „divide și stăpânește”: împarte tabloul în jumătate, sortează recursiv fiecare jumătate, apoi interclasează cele două jumătăți sortate. Se execută în timp O(N log N).

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 1000)
- Următoarele `N` linii: câte un număr întreg

### Rezultat

Cele `N` numere întregi sortate crescător, separate prin spații, pe o singură linie.

### Exemple

```
Intrare:
5
38
27
43
3
9
Ieșire: 3 9 27 38 43
```

```
Intrare:
4
4
3
2
1
Ieșire: 1 2 3 4
```

```
Intrare:
1
42
Ieșire: 42
```

Cazul de bază: un tablou cu un singur element este deja sortat.

```
Intrare:
5
-1
-5
0
-5
3
Ieșire: -5 -5 -1 0 3
```

Numerele negative și duplicatele se sortează la fel ca orice alte numere întregi.
