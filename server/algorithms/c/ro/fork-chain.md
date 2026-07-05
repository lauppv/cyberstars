# Dificil · Lanț de trei generații

Un proces "bunic" creează un proces "tată" prin fork. La rândul lui, "tatăl" creează un proces "nepot". Fiecare generație afișează nivelul ei și PID-ul propriu, dar tipărirea se face **de la nepot spre bunic**: fiecare părinte așteaptă cu **wait(NULL)** ca al lui copil să termine înainte să tipărească.

Structura seamănă cu **fork în fork**: după primul `fork()`, în copil apelăm din nou `fork()`. Trebuie multă grijă la ordinea `return 0` — dacă nu iese unde trebuie, procesele "greșite" continuă codul de mai jos.

### Date de intrare

- Fără intrare.

### Rezultat

- 3 linii, în ordinea inversă a generațiilor:
  - `Nivel 2 (nepot): PID X`
  - `Nivel 1 (tata): PID Y`
  - `Nivel 0 (bunic): PID Z`

PID-urile diferă la fiecare rulare, dar ordinea liniilor rămâne mereu nepot → tată → bunic.

### Exemplu

```
Ieșire:
Nivel 2 (nepot): PID 45
Nivel 1 (tata): PID 44
Nivel 0 (bunic): PID 43
```

Folosește **fork()**, **getpid()** și **wait(NULL)**.
