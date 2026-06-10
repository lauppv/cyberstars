# Hard · Group Anagrams

Având o listă de cuvinte, grupează împreună toate **anagramele**. Două cuvinte sunt anagrame dacă conțin aceleași litere într-o ordine diferită (de exemplu, "listen" și "silent").

Afișează fiecare grup pe o linie separată, cu cuvintele sortate alfabetic în cadrul grupului. Sortează grupurile după primul lor cuvânt (alfabetic).

### Date de intrare

- Linia 1: un număr întreg `n` — numărul de cuvinte.
- Următoarele `n` linii: un cuvânt pe linie (doar litere mici).

### Rezultat

Un grup pe linie. Cuvintele din fiecare grup sunt sortate alfabetic și separate prin spații. Grupurile sunt sortate după primul lor cuvânt.

### Exemple

```
Intrare:
6
eat
tea
tan
ate
nat
bat

Ieșire:
ate eat tea
bat
nat tan
```

```
Intrare:
3
listen
silent
hello

Ieșire:
hello
listen silent
```

### Indicii

- Două cuvinte sunt anagrame dacă sortarea caracterelor lor dă același șir: `sorted("eat") == sorted("tea")`.
- Folosește un dicționar cu caracterele sortate drept cheie, și o listă de cuvinte drept valoare.
- După grupare, sortează fiecare grup alfabetic, apoi sortează toate grupurile după primul lor cuvânt.
- `collections.defaultdict(list)` este util pentru construirea grupurilor.
