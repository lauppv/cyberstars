# Ușor · Lungimea unui șir

Citește un șir (un singur cuvânt, fără spații) și calculează lungimea lui **fără** a folosi `strlen()`. Afișează lungimea.

Acest exercițiu antrenează parcurgerea manuală a unui șir în C — iterarea caracter cu caracter până la terminatorul nul `'\0'`.

### Date de intrare

Un singur cuvânt (maxim 1000 de caractere, fără spații).

### Rezultat

Un singur întreg: lungimea șirului.

### Exemple

```
Intrare:  hello
Ieșire: 5
```

```
Intrare:  C
Ieșire: 1
```

```
Intrare:  12345
Ieșire: 5
```

Cifrele sunt tot caractere — numărătoarea lungimii nu ține cont de ce fel de
caractere sunt.

### Indicii

- Folosește `scanf("%s", str)` pentru a citi un cuvânt.
- Parcurge caracterele: `while (str[i] != '\0')` și numără.
- NU folosi `strlen` — scopul este să o implementezi singur.
