Proiectul final! Vom construi o piesă mică dintr-un **shell** — programul care rulează când deschizi un terminal. Acesta combină fork, pipe-uri și tot ce am învățat

Un shell real face așa: citește o comandă → fork → copilul rulează comanda → părintele așteaptă. Vom construi o versiune simplificată care rulează o secvență fixă de "comenzi" (funcții), demonstrând tiparul fork-and-wait

---

Iată ideea de bază

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void ruleaza_comanda(const char *comanda) {
    pid_t pid = fork();

    if (pid == 0) {
        // Copilul: execută comanda
        printf("[copil %d] Ruleaza: %s\n", getpid(), comanda);

        if (strcmp(comanda, "hello") == 0) {
            printf("Salut, CyberStars!\n");
        } else if (strcmp(comanda, "data") == 0) {
            printf("2025-01-01\n");
        } else {
            printf("Comanda necunoscuta: %s\n", comanda);
        }
        _exit(0);   // copilul iese
    } else {
        // Părintele: așteaptă copilul
        int status;
        waitpid(pid, &status, 0);
        printf("[parinte] Copilul a terminat cu codul %d\n",
               WEXITSTATUS(status));
    }
}

int main(void) {
    ruleaza_comanda("hello");
    ruleaza_comanda("data");
    ruleaza_comanda("comanda_necunoscuta");
    return 0;
}
```

**\_exit(0)** este ca **return 0** dar pentru procesele copil după fork — iese imediat fără să ruleze curățenie care ar putea încurca părintele

**WEXITSTATUS(status)** extrage codul real de ieșire din valoarea status pe care ne-o dă **waitpid**

---

Părintele creează un copil pentru fiecare comandă, așteaptă să termine, apoi trece la următoarea. Exact asta face bash (simplificat). Fiecare comandă rulează în **izolare** — dacă copilul crapă, părintele supraviețuiește și merge mai departe

---

## Misiune: Terminalul de Comandă al Stației

Terminalul de urgență al stației este offline. Rex are nevoie de tine să reconstruiești un shell minimal care să poată dispecera comenzi către procese copil. Fiecare comandă rulează în izolare — dacă una crapă, shell-ul supraviețuiește.

Completează funcția **ruleaza_comanda** din dreapta și apeleaz-o din main cu aceste comenzi: **"saluta"**, **"numara"** și **"necunoscut"**

1. Procesul copil verifică șirul comenzii și rulează acțiunea corespunzătoare:
   - **"saluta"** afișează **"Salut de la CyberStars!"**
   - **"numara"** afișează **"1 2 3"** (pe aceeași linie, separate prin spații)
   - orice altceva afișează **"Eroare: comanda necunoscuta"**
2. Părintele așteaptă copilul, apoi afișează **"Gata"**

**Output**

```text
Salut de la CyberStars!
Gata
1 2 3
Gata
Eroare: comanda necunoscuta
Gata
```
