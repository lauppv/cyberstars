Împarte un vector în două jumătăți și paralelizează adunarea: copilul sumează prima jumătate, părintele sumează a doua. Copilul trimite suma lui printr-un pipe, iar părintele adună cele două părți și afișează totalul.

Când `N` e impar, prima jumătate are `N/2` elemente, iar a doua jumătate `N - N/2` — o împărțire care iese cinstit fără resturi ciudate.

### Date de intrare

- Prima linie: numărul întreg `N` (1 ≤ N ≤ 100)
- Următoarele `N` linii: câte un număr întreg (fiecare între -1000 și 1000)

### Rezultat

- Un singur rând: `Suma: X` unde X este suma tuturor celor N numere.

### Exemple

```
Intrare:
4
10
20
30
40
Ieșire:
Suma: 100
```

```
Intrare:
5
1
2
3
4
5
Ieșire:
Suma: 15
```

În primul exemplu, copilul calculează `10 + 20 = 30`, părintele calculează `30 + 40 = 70`, iar totalul este 100.

Folosește **pipe()**, **fork()** și **wait(NULL)**.
