**Adâncimea** unui arbore e câte noduri are cel mai lung drum de la rădăcină până jos, la o frunză. Citește un arbore binar și afișează-i adâncimea. Un arbore gol are adâncimea 0.

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

Codul de început citește deja datele și construiește arborele din `struct Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează ce întoarce `adancime_maxima`. Tu scrii `adancime_maxima`.

### Date de intrare

- Linia 1: arborele, scris ca mai sus. Arborele are cel mult 500 de noduri, fiecare valoare între -10^4 și 10^4.

### Rezultat

Un număr întreg: adâncimea arborelui.

### Exemple

```
Intrare:
8 4 11 2 null 9 15

Ieșire:
3
```

```
Intrare:
5 null 7 null 9

Ieșire:
3
```

Arborele e o singură ramură spre dreapta: `5`, apoi `7`, apoi `9`, deci adâncime trei.

```
Intrare:
42

Ieșire:
1
```

O rădăcină singură are adâncimea unu.

```
Intrare:
null

Ieșire:
0
```

Un arbore gol nu are niciun nod.
