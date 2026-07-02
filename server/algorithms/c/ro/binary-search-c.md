# Ușor · Căutare binară

Citește un tablou sortat de **N** numere întregi și o valoare căutată. Găsește valoarea folosind **căutarea binară** și afișează indicele ei (începând de la 0), sau **-1** dacă valoarea nu este găsită.

Căutarea binară funcționează înjumătățind în mod repetat intervalul de căutare. Compară valoarea căutată cu elementul din mijloc: dacă sunt egale, ai găsit-o; dacă este mai mică, caută în jumătatea stângă; dacă este mai mare, caută în jumătatea dreaptă. Se execută în timp O(log N).

### Date de intrare

- Prima linie: un întreg `N` (1 ≤ N ≤ 1000)
- A doua linie: `N` numere întregi sortate crescător, separate prin spații
- A treia linie: un întreg `target` de căutat

### Rezultat

Un singur întreg: indicele (începând de la 0) al valorii căutate în tablou, sau `-1` dacă nu este găsită.

### Exemple

```
Intrare:
5
1 3 5 7 9
5
Ieșire: 2
```

```
Intrare:
4
10 20 30 40
25
Ieșire: -1
```

```
Intrare:
1
5
5
Ieșire: 0
```

Un tablou cu un singur element funcționează la fel — `left` și `right` pornesc amândoi de la 0.

```
Intrare:
1
5
3
Ieșire: -1
```
