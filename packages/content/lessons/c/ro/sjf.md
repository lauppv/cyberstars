FCFS lăsa lucrările scurte să aștepte în spatele celor lungi. **SJF**, „shortest job first”, adică întâi lucrarea cea mai scurtă, repară asta: de fiecare dată când procesorul e liber, alege, dintre procesele care au sosit deja, pe cel cu **timpul de execuție cel mai scurt**. Acela rulează până la capăt, apoi planificatorul alege din nou

```text
nume  sosire  executie
P1       0       7
P2       1       4
P3       2       1
P4       3       4
```

La 0 e doar P1, deci rulează de la 0 la 7. La 7, P2, P3 și P4 așteaptă toate. P3 e cel mai scurt, deci rulează de la 7 la 8. Apoi P2 și P4 au nevoie amândouă de 4: când timpii de execuție sunt egali, merge întâi cel sosit primul, deci P2 rulează de la 8 la 12, apoi P4 de la 12 la 16

```text
0-7 P1
7-8 P3
8-12 P2
12-16 P4
```

Cu FCFS, așteptarea medie aici ar fi 6.00. Cu SJF e 5.25

---

Se poate demonstra că SJF dă **cea mai mică așteptare medie posibilă** dintre toți algoritmii care lasă un proces să ruleze până la capăt odată ce a pornit. Lucrările scurte pleacă repede, deci în fiecare moment așteaptă mai puține procese

Dar are două probleme

1. Un planificator adevărat nu știe cât va rula un proces. Sistemele adevărate **ghicesc**, după cât a rulat procesul data trecută
2. Un proces lung poate aștepta la nesfârșit dacă tot sosesc unele scurte. Asta se numește **înfometare** (starvation)

---

Simularea are nevoie de o buclă care alege de fiecare dată următorul proces. Marcăm procesele terminate. Când n-a sosit încă nimic, procesorul stă degeaba până la următoarea sosire

```c
#include <stdio.h>

int main(void) {
    int n = 4;
    int sosire[] = { 0, 1, 2, 3 };
    int executie[] = { 7, 4, 1, 4 };
    int gata[] = { 1, 0, 0, 0 };
    int ceas = 7;

    int ales = -1;
    for (int i = 0; i < n; i++) {
        if (gata[i] || sosire[i] > ceas) {
            continue;
        }
        if (ales == -1 || executie[i] < executie[ales] ||
            (executie[i] == executie[ales] && sosire[i] < sosire[ales])) {
            ales = i;
        }
    }
    printf("la %d: P%d\n", ceas, ales + 1);
    return 0;
}
```

Ieșire

```text
la 7: P3
```

Dacă parcurgem i de la 0 în sus și înlocuim ales doar când cel nou e strict mai bun, păstrăm și ordinea de la intrare când totul e egal

---

## Misiune: Întâi lucrarea cea mai scurtă

Simulează SJF, varianta în care un proces rulează până la capăt odată ce a pornit

1. Citește n, apoi n linii cu un nume, un timp de sosire și un timp de execuție
2. De fiecare dată când procesorul e liber, alege dintre procesele care au sosit și nu sunt terminate: timpul de execuție cel mai scurt, apoi sosirea cea mai devreme, apoi pe cel venit primul la intrare. Dacă n-a sosit niciunul, procesorul stă degeaba până la următoarea sosire
3. Afișează linia timpului, apoi timpii de așteptare și de răspuns ai fiecărui proces, în ordinea de la intrare, apoi cele două medii cu două zecimale, în același format ca în lecția despre FCFS

n e între 1 și 20. Numele au cel mult 7 caractere. Timpii de sosire sunt între 0 și 100, iar cei de execuție între 1 și 50

**Exemplu**

Intrare

```text
4
P1 0 7
P2 1 4
P3 2 1
P4 3 4
```

Ieșire

```text
0-7 P1
7-8 P3
8-12 P2
12-16 P4
P1: asteptare 0, raspuns 7
P2: asteptare 7, raspuns 11
P3: asteptare 5, raspuns 6
P4: asteptare 9, raspuns 13
Asteptare medie: 5.25
Raspuns mediu: 9.25
```
