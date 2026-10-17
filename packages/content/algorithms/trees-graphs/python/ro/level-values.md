Citește un arbore binar și afișează-i valorile nivel cu nivel: rădăcina pe prima linie, copiii ei pe a doua, copiii lor pe a treia și tot așa. Fiecare linie are valorile nivelului ei de la stânga la dreapta, despărțite de câte un spațiu. Un arbore gol nu afișează nimic.

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

Codul de început citește deja datele și construiește arborele din `Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi apelează `afiseaza_nivelurile`. Tu scrii `afiseaza_nivelurile`, care afișează nivelurile.

### Date de intrare

- Linia 1: arborele, scris ca mai sus. Arborele are cel mult 500 de noduri, fiecare valoare între -10^4 și 10^4.

### Rezultat

Câte o linie pentru fiecare nivel, de la rădăcină în jos, cu valorile lui de la stânga la dreapta.

### Exemple

```
Intrare:
8 4 11 2 null 9 15

Ieșire:
8
4 11
2 9 15
```

```
Intrare:
1 null 2 3

Ieșire:
1
2
3
```

`2` e copilul drept al lui `1`, iar `3` copilul stâng al lui `2`: trei niveluri cu câte o valoare.

```
Intrare:
7

Ieșire:
7
```

O rădăcină singură e un singur nivel.
