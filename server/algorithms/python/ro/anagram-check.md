# Verificare anagramă

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

### Indicii

- Convertește mai întâi ambele șiruri la litere mici cu `.lower()`.
- O abordare: sortează ambele șiruri și compară-le — `sorted(a) == sorted(b)`.
- O altă abordare: numără frecvența fiecărei litere folosind un `dict` sau `collections.Counter`.
- Anagramele trebuie să aibă aceeași lungime, așa că poți verifica asta mai întâi ca ieșire timpurie.
