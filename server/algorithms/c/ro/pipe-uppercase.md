# Ușor · Litere mari prin pipe

Un părinte citește un cuvânt de la tastatură și îl trimite copilului printr-un pipe. Copilul primește cuvântul, îl convertește la litere mari și îl afișează.

Un **pipe** este un canal unidirecțional între procese: unul scrie într-un capăt (`p[1]`), celălalt citește din capătul opus (`p[0]`). Închidem capetele nefolosite ca să evităm confuziile — dacă părintele nu închide `p[0]`, copilul nu vede sfârșitul fluxului la citire.

### Date de intrare

- Linia 1: un cuvânt de cel mult 100 de caractere, format doar din litere lowercase.

### Rezultat

- O singură linie: cuvântul convertit la litere mari (uppercase).

### Exemple

```
Intrare:
hello
Ieșire:
HELLO
```

```
Intrare:
cyberstars
Ieșire:
CYBERSTARS
```

Folosește **pipe()**, **fork()**, **read()**, **write()** din `unistd.h`, **wait(NULL)** din `sys/wait.h` și **toupper()** din `ctype.h`.
