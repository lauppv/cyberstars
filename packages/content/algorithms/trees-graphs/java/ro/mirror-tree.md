**Oglinda** unui arbore binar e arborele pe care l-ai vedea într-o oglindă ținută lângă el: copiii stâng și drept ai fiecărui nod își schimbă locurile, până jos. Citește un arbore binar și afișează-i oglinda, scrisă la fel.

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

Codul de început citește deja datele și construiește arborele din `Nod`-uri cu `valoare`, `stanga` și `dreapta`, apoi afișează arborele pe care îl întoarce `oglindeste`, scris la fel. Tu scrii `oglindeste`: poate întoarce arborele pe loc sau poate construi unul nou.

### Date de intrare

- Linia 1: arborele, scris ca mai sus. Arborele are cel mult 500 de noduri, fiecare valoare între -10^4 și 10^4.

### Rezultat

Arborele oglindit pe o linie, scris ca mai sus, fără `null`-urile de la sfârșit.

### Exemple

```
Intrare:
8 4 11 2 null 9 15

Ieșire:
8 11 4 15 9 null 2
```

În oglindă `11` vine înaintea lui `4`, `15` înaintea lui `9`, iar `2` trece în dreapta lui `4`:

```
        8
      /   \
    11     4
   /  \     \
  15   9     2
```

```
Intrare:
5 null 7 null 9

Ieșire:
5 7 null 9
```

O ramură spre dreapta devine o ramură spre stânga.

```
Intrare:
null

Ieșire:
null
```

Oglinda unui arbore gol e tot goală.
