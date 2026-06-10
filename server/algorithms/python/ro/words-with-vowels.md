# Cuvinte cu două vocale

Având o propoziție, afișează fiecare cuvânt care conține **exact 2 vocale**.

### Date de intrare

O singură linie care conține o propoziție (cuvinte separate prin spații, doar litere).

### Rezultat

Cuvintele care se potrivesc, fiecare pe o linie separată, în ordinea în care apar. Dacă niciun cuvânt nu se potrivește, nu afișa nimic.

### Exemple

```
Intrare:  hello world apple
Ieșire:
hello
apple
```

```
Intrare:  cat dog fly
Ieșire: (nimic)
```

### Indicii

- Folosește `.split()` pentru a împărți propoziția în cuvinte.
- Pentru fiecare cuvânt, numără câte caractere sunt în `"aeiouAEIOU"`.
- O buclă `for` în interiorul unei bucle `for` — una pentru cuvinte, una pentru caractere.
