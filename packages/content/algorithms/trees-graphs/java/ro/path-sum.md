O **frunză** e un nod fără copii. Citește un arbore binar și un număr și afișează `true` dacă un drum de la rădăcină până jos, la o frunză, are valorile cu suma egală cu numărul, `false` dacă niciunul nu are. Un arbore gol nu are niciun drum.

### Cum se scrie un arbore

Un arbore vine pe o singură linie, citit nivel cu nivel, de la stânga la dreapta. După un nod vin două locuri pentru copiii lui, întâi cel stâng, iar un copil care lipsește se scrie `null`. `null`-urile de la sfârșit se lasă deoparte, iar un arbore gol e doar `null`.

```
        8
      /   \
     4     11
    /     /  \
   2     9    15
```

Arborele acesta se scrie `8 4 11 2 null 9 15`: întâi `8`, apoi copiii lui, `4` și `11`, apoi copiii lui `4` (`2` și niciunul), apoi cei ai lui `11` (`9` și `15`). Copiii lui `2`, `9` și `15` ar fi toți `null` la sfârșit, așa că se lasă deoparte.

Partea ascunsă a programului citește deja datele și construiește arborele din `Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează `true` sau `false` după ce întoarce `areDrumCuSuma`. Tu scrii `areDrumCuSuma`.

### Date de intrare

- Linia 1: arborele, scris ca mai sus. Arborele are cel mult 500 de noduri, fiecare valoare între -10^4 și 10^4.
- Linia 2: suma căutată, între -5·10^6 și 5·10^6.

### Rezultat

`true` dacă un drum de la rădăcină la o frunză are suma căutată, altfel `false`.

### Exemple

```
Intrare:
8 4 11 2 null 9 15
28

Ieșire:
true
```

`8 + 11 + 9` face `28`, iar `9` e o frunză.

```
Intrare:
8 4 11 2 null 9 15
12

Ieșire:
false
```

`8 + 4` face `12`, dar `4` nu e o frunză: drumul trebuie să meargă mai departe, la `2`, și atunci suma e `14`.

```
Intrare:
-2 null -3
-5

Ieșire:
true
```

```
Intrare:
null
0

Ieșire:
false
```

Un arbore gol nu are niciun drum, nici măcar unul cu suma `0`.
