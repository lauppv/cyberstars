Două șiruri sunt **anagrame** dacă conțin exact aceleași caractere, doar într-o ordine diferită. Având două șiruri, determină dacă sunt anagrame unul față de celălalt (fără a ține cont de litere mari/mici).

### Date de intrare

- Linia 1: un șir `a`.
- Linia 2: un șir `b`.

Ambele șiruri conțin doar litere (fără spații sau semne de punctuație).

### Rezultat

Afișează `True` dacă șirurile sunt anagrame, `False` altfel.

### Exemple

```
Intrare:
listen
silent

Ieșire:
True
```

```
Intrare:
hello
world

Ieșire:
False
```

```
Intrare:
Elvis
Lives

Ieșire:
True
```

Comparația nu ține cont de litere mari/mici: `Elvis` și `Lives` se potrivesc doar
după ce ambele sunt convertite la litere mici.

```
Intrare:
aabb
abab

Ieșire:
True
```

Literele repetate contează la fel, atât timp cât fiecare literă apare de același
număr de ori în ambele șiruri — ordinea nu contează, doar numărul de apariții.

```
Intrare:
a
a

Ieșire:
True
```

```
Intrare:
ab
abc

Ieșire:
False
```

Șiruri de lungimi diferite nu pot fi niciodată anagrame — e un mod rapid de a
elimina o nepotrivire înainte de a compara literele.
