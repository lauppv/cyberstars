# Mediu · Cifrul lui Caesar

Criptează un șir folosind **cifrul lui Cezar**. Fiecare literă este deplasată înainte în alfabet cu o anumită valoare. Literele mari rămân mari, literele mici rămân mici, iar caracterele care nu sunt litere rămân neschimbate.

De exemplu, cu o deplasare de 3: `A` devine `D`, `z` devine `c`, iar `5` rămâne `5`.

### Date de intrare

- Prima linie: un șir (poate conține spații, până la 200 de caractere)
- A doua linie: un întreg `shift` (1 ≤ shift ≤ 25)

### Rezultat

Șirul criptat pe o singură linie.

### Exemple

```
Intrare:
Hello, World!
3
Ieșire: Khoor, Zruog!
```

```
Intrare:
xyz
2
Ieșire: zab
```

```
Intrare:
A
1
Ieșire: B
```

```
Intrare:
123
5
Ieșire: 123
```

Cifrele nu sunt litere, deci trec prin cifru neschimbate.

### Indicii

- Folosește `fgets` pentru a citi șirul (gestionează spațiile). Elimină caracterul newline de la final, dacă există.
- Pentru o literă mică `c`: `encrypted = (c - 'a' + shift) % 26 + 'a'`.
- Pentru o literă mare `c`: `encrypted = (c - 'A' + shift) % 26 + 'A'`.
- Folosește `strlen` din `<string.h>` pentru a parcurge șirul.
