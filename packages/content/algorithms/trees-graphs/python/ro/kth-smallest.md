Citește un arbore binar de căutare și un număr `k` și afișează a `k`-a cea mai mică valoare din arbore, numărând de la 1.

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

Codul de început citește deja datele și construiește arborele din `Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează ce întoarce `a_k_a_cea_mai_mica`. Tu scrii `a_k_a_cea_mai_mica`, care primește rădăcina și pe `k`.

### Date de intrare

- Linia 1: un arbore binar de căutare, scris ca mai sus, cu 1 până la 500 de noduri, fiecare valoare între -10^4 și 10^4.
- Linia 2: `k`, cu `1 <= k <=` numărul de noduri.

### Rezultat

Un număr întreg: a `k`-a cea mai mică valoare.

### Exemple

```
Intrare:
8 4 11 2 null 9 15
3

Ieșire:
8
```

În ordine valorile sunt `2 4 8 9 11 15`, iar a treia e `8`.

```
Intrare:
8 4 11 2 null 9 15
1

Ieșire:
2
```

```
Intrare:
20 10 30 null 15
2

Ieșire:
15
```

A doua cea mai mică nu e mereu părintele celei mai mici: aici e `15`, copilul drept al lui `10`.
