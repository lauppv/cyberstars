# Dificil · Grupează anagramele

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

```
Intrare:
3
abc
def
ghi

Ieșire:
abc
def
ghi
```

Când niciun cuvânt nu este anagrama altuia, fiecare grup are exact un cuvânt —
grupurile sunt afișate în continuare în ordine alfabetică după primul (și
singurul) cuvânt.

```
Intrare:
1
cat

Ieșire:
cat
```
