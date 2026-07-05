# Ușor · Doi PID-uri

Un părinte și un copil vor să confirme legătura dintre ei: fiecare afișează PID-ul celuilalt. Copilul află PID-ul părintelui folosind **getppid()**, iar părintele primește PID-ul copilului direct din valoarea returnată de **fork()**.

Fork returnează:

- `0` copilului
- PID-ul copilului părintelui

Copilul afișează primul, iar părintele așteaptă cu **wait(NULL)** înainte să afișeze propriul mesaj — așa garantăm ordinea liniilor.

### Date de intrare

- Fără intrare.

### Rezultat

- Prima linie (din copil): `Copil: parintele meu este X`
- A doua linie (din parinte): `Parinte: copilul meu este Y`

Copilul afișează întotdeauna primul, pentru că părintele așteaptă până se termină copilul.

### Exemplu

PID-urile diferă la fiecare rulare; important este raportul dintre ele.

```
Ieșire:
Copil: parintele meu este 42
Parinte: copilul meu este 43
```

Folosește **fork()**, **getpid()**, **getppid()** din `unistd.h` și **wait(NULL)** din `sys/wait.h`.
