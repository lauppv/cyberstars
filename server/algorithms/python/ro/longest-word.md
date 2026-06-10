# Cel mai lung cuvânt

Având o propoziție, găsește și afișează **cel mai lung cuvânt**.

### Date de intrare

O singură linie care conține o propoziție de cuvinte separate prin spații.

### Rezultat

Afișează cel mai lung cuvânt din propoziție. Dacă există o egalitate, afișează-l pe cel care apare primul.

### Exemple

```
Intrare:  I love programming
Ieșire: programming
```

```
Intrare:  The quick brown fox
Ieșire: quick
```

### Indicii

- Folosește `split()` pentru a împărți propoziția într-o listă de cuvinte.
- Funcția `len()` îți spune cât de lung este un șir.
- Poți folosi `max()` cu un argument `key`: `max(words, key=len)`.
