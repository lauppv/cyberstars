Un **strămoș** al unui nod e orice nod de pe drumul de la rădăcină până la el, inclusiv nodul însuși. **Cel mai jos strămoș comun** a două noduri e strămoșul pe care îl au amândouă și care stă cel mai jos. Citește un arbore binar de căutare și două valori din el și afișează valoarea celui mai jos strămoș comun al lor.

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

Într-un **arbore binar de căutare** orice valoare din subarborele stâng al unui nod e mai mică decât valoarea nodului, orice valoare din subarborele drept e mai mare, iar nicio valoare nu se repetă. Arborele de mai sus e unul.

Codul de început citește deja datele și construiește arborele din `struct Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează ce întoarce `stramos_comun`. Tu scrii `stramos_comun`, care primește rădăcina și cele două valori.

### Date de intrare

- Linia 1: un arbore binar de căutare, scris ca mai sus, cu 2 până la 500 de noduri, fiecare valoare între -10^4 și 10^4.
- Linia 2: două valori diferite `p` și `q`, amândouă din arbore, despărțite de un spațiu.

### Rezultat

Un număr întreg: valoarea celui mai jos strămoș comun al lui `p` și `q`.

### Exemple

```
Intrare:
8 4 11 2 null 9 15
2 9

Ieșire:
8
```

`2` e în stânga lui `8`, iar `9` în dreapta lui, așa că drumurile spre ei se despart la `8`.

```
Intrare:
8 4 11 2 null 9 15
15 9

Ieșire:
11
```

```
Intrare:
8 4 11 2 null 9 15
4 2

Ieșire:
4
```

`4` e strămoș al lui `2` și al lui însuși.
