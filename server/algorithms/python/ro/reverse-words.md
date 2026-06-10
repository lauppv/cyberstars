# Reverse Words

Având o propoziție, afișează **cuvintele în ordine inversă**.

Notă: inversezi ordinea cuvintelor, nu caracterele din interiorul lor.

### Date de intrare

O singură linie care conține o propoziție de cuvinte separate prin spații.

### Rezultat

Afișează cuvintele în ordine inversă, separate prin spații.

### Exemple

```
Intrare:  hello world
Ieșire: world hello
```

```
Intrare:  I love Python
Ieșire: Python love I
```

### Indicii

- Folosește `split()` pentru a obține o listă de cuvinte.
- Poți inversa o listă cu `[::-1]` sau cu funcția `reversed()`.
- Folosește `" ".join(...)` pentru a recombina cuvintele într-un singur șir.
