# Caesar Cipher

Criptează un șir folosind **cifrul Caesar**: deplasează fiecare literă înainte cu un număr dat de poziții în alfabet. Caracterele care nu sunt litere rămân neschimbate.

### Date de intrare

- Linia 1: un șir `s` (poate conține litere mari, litere mici, spații și semne de punctuație).
- Linia 2: un număr întreg `shift` (1-25).

### Rezultat

Șirul criptat, păstrând litera mare/mică originală a fiecărei litere.

### Exemple

```
Intrare:
abc
3

Ieșire:
def
```

```
Intrare:
Hello, World!
5

Ieșire:
Mjqqt, Btwqi!
```

### Indicii

- Folosește `ord()` pentru a obține codul ASCII al unui caracter și `chr()` pentru a converti înapoi.
- Pentru o literă mică: `chr((ord(ch) - ord('a') + shift) % 26 + ord('a'))`.
- Tratează literele mari separat cu `ord('A')`.
- Folosește `.isalpha()` pentru a verifica dacă un caracter este o literă.
