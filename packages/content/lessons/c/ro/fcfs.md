Un calculator cu un singur nucleu de procesor poate rula un singur proces la un moment dat. Când sunt gata mai multe procese, sistemul de operare trebuie să aleagă care rulează următorul. Partea aceasta a kernelului e **planificatorul** (scheduler), iar regula pe care o folosește e un **algoritm de planificare**. Lecțiile următoare sunt despre cei clasici. Nu vom schimba un kernel adevărat: îi vom **simula**, ca în exercițiile de la un curs de sisteme de operare

---

Fiecare proces din aceste exerciții are

- un nume, de exemplu P1
- un timp de **sosire** (arrival): când devine gata să ruleze
- un timp de **execuție** (burst): cât timp are nevoie de procesor

Și pentru fiecare măsurăm

- **timpul de răspuns** (turnaround): de la sosire până la terminare. Cât a durat, cu tot cu așteptarea
- **timpul de așteptare** (waiting): cât timp a fost gata, dar n-a rulat. Adică turnaround minus burst

Un algoritm bun ține mică media timpului de așteptare

---

Cel mai simplu algoritm e **FCFS**, „first come, first served”, adică primul venit, primul servit. Procesele rulează în ordinea în care sosesc, fiecare până la capăt, ca o coadă la un ghișeu. Dacă procesorul e liber și n-a sosit încă nimeni, așteaptă: timpul acela îl numim **idle** (inactiv)

```text
nume  sosire  executie
P1       0       5
P2       1       3
P3       2       1
```

P1 sosește primul și rulează de la 0 la 5. P2 a sosit la 1 și rulează de la 5 la 8. P3 rulează de la 8 la 9. Desenăm asta ca o linie a timpului, numită **diagramă Gantt**

```text
0-5 P1
5-8 P2
8-9 P3
```

P3 avea nevoie doar de o unitate, dar a așteptat 6. Ăsta e punctul slab al lui FCFS, **efectul de convoi**: lucrări scurte blocate în spatele uneia lungi, ca mașinile în spatele unui camion lent

---

Ca să calculăm timpii, ținem un ceas. Pentru fiecare proces, în ordinea sosirii: dacă ceasul e mai devreme decât sosirea lui, procesorul stă degeaba până atunci. Procesul pornește la ceas, se termină la ceas + burst, iar ceasul trece la terminarea lui

```c
#include <stdio.h>

int main(void) {
    int n = 3;
    int sosire[] = { 0, 1, 2 };
    int executie[] = { 5, 3, 1 };

    int ceas = 0;
    for (int i = 0; i < n; i++) {
        if (ceas < sosire[i]) {
            ceas = sosire[i];
        }
        int start = ceas;
        ceas = ceas + executie[i];
        int final = ceas;
        printf("%d-%d P%d\n", start, final, i + 1);
    }
    return 0;
}
```

Ieșire

```text
0-5 P1
5-8 P2
8-9 P3
```

Ca să afișăm mediile cu două zecimale, împărțim ca double și folosim **%.2f**

---

## Misiune: Primul venit, primul servit

Sala lucrărilor în lot rulează lucrările strict în ordinea în care sosesc. Simuleaz-o

1. Citește n, apoi n linii cu un nume, un timp de sosire și un timp de execuție
2. Ordonează procesele după timpul de sosire. Când două sosesc în același timp, păstrează-le ordinea de la intrare
3. Rulează-le cu FCFS. Afișează linia timpului, câte o linie pentru fiecare bucată de timp, cu `idle` acolo unde procesorul așteaptă
4. Apoi, în ordinea de la intrare, afișează timpul de așteptare și timpul de răspuns al fiecărui proces, iar la final cele două medii, cu două zecimale, ca în exemplu

n e între 1 și 20. Numele au cel mult 7 caractere. Timpii de sosire sunt între 0 și 100, iar cei de execuție între 1 și 50

**Exemplu**

Intrare

```text
3
P1 0 5
P2 1 3
P3 7 1
```

Ieșire

```text
0-5 P1
5-8 P2
8-9 P3
P1: asteptare 0, raspuns 5
P2: asteptare 4, raspuns 7
P3: asteptare 1, raspuns 2
Asteptare medie: 1.67
Raspuns mediu: 4.67
```

**Exemplu**

Intrare

```text
2
A 3 2
B 0 1
```

Ieșire

```text
0-1 B
1-3 idle
3-5 A
A: asteptare 0, raspuns 2
B: asteptare 0, raspuns 1
Asteptare medie: 0.00
Raspuns mediu: 1.50
```
