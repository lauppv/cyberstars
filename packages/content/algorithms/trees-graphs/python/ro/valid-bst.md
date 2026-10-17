Citește un arbore binar și afișează `true` dacă e un arbore binar de căutare, `false` dacă nu. Un arbore gol este unul.

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

Codul de început citește deja datele și construiește arborele din `Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează `true` sau `false` după ce întoarce `este_arbore_de_cautare`. Tu scrii `este_arbore_de_cautare`.

### Date de intrare

- Linia 1: arborele, scris ca mai sus. Arborele are cel mult 500 de noduri, fiecare valoare între -10^4 și 10^4. Valorile se pot repeta.

### Rezultat

`true` dacă arborele e un arbore binar de căutare, altfel `false`.

### Exemple

```
Intrare:
8 4 11 2 null 9 15

Ieșire:
true
```

```
Intrare:
8 4 11 2 9

Ieșire:
false
```

`9` e copilul drept al lui `4`, deci e în subarborele stâng al lui `8`, dar e mai mare decât `8`.

```
Intrare:
5 5

Ieșire:
false
```

Două valori egale nu pot fi amândouă într-un arbore binar de căutare.

```
Intrare:
null

Ieșire:
true
```

Un arbore gol e un arbore binar de căutare.
