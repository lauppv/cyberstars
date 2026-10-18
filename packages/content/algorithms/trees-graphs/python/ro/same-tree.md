Doi arbori binari sunt **la fel** când au aceeași formă și aceeași valoare în fiecare pereche de noduri de pe aceeași poziție. Citește doi arbori și afișează `true` dacă sunt la fel, `false` dacă nu. Doi arbori goi sunt la fel.

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

Partea ascunsă a programului citește deja datele și construiește ambii arbori din `Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează `true` sau `false` după ce întoarce `acelasi_arbore`. Tu scrii `acelasi_arbore`.

### Date de intrare

- Linia 1: primul arbore, scris ca mai sus.
- Linia 2: al doilea arbore, scris la fel.
- Fiecare arbore are cel mult 500 de noduri, fiecare valoare între -10^4 și 10^4.

### Rezultat

`true` dacă cei doi arbori sunt la fel, altfel `false`.

### Exemple

```
Intrare:
8 4 11 2 null 9 15
8 4 11 2 null 9 15

Ieșire:
true
```

```
Intrare:
1 2
1 null 2

Ieșire:
false
```

Ambii arbori au `1` și `2`, dar în primul `2` e copilul stâng, iar în al doilea e cel drept.

```
Intrare:
6 3 9
6 3 10

Ieșire:
false
```

Aceeași formă, dar o pereche de noduri are valori diferite.

```
Intrare:
null
null

Ieșire:
true
```

Doi arbori goi sunt la fel.
