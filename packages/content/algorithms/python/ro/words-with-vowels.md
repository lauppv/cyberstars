Având o propoziție, afișează fiecare cuvânt care conține **exact 2 vocale**.

### Date de intrare

O singură linie de 1 până la 10^5 caractere care conține o propoziție cu cel puțin un cuvânt. Cuvintele conțin doar litere din alfabetul englez (`a`-`z`, `A`-`Z`) și sunt separate prin unul sau mai multe spații, iar linia poate începe sau se poate termina cu spații.

### Rezultat

Cuvintele care se potrivesc, fiecare pe o linie separată, în ordinea în care apar. Dacă niciun cuvânt nu se potrivește, nu afișa nimic. Vocalele sunt `a`, `e`, `i`, `o`, `u`, mari sau mici.

### Exemple

```
Intrare:  hello world apple
Ieșire:
hello
apple
```

```
Intrare:  cat dog fly
Ieșire:
```

Niciunul dintre aceste cuvinte nu are exact 2 vocale (`cat` are 1, `dog` are
1, `fly` are 0), deci nu se afișează nimic, nici măcar o linie goală.

```
Intrare:  bee tree free
Ieșire:
bee
tree
free
```

Toate cuvintele se pot potrivi. Nu există o regulă care să spună că doar unele
au voie.
