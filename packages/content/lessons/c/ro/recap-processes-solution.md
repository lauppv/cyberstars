```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char linii[10][128];
    pid_t pids[10];
    int coduri[10];
    int n = 0;

    while (n < 10 && fgets(linii[n], sizeof(linii[n]), stdin) != NULL) {
        linii[n][strcspn(linii[n], "\n")] = '\0';
        n++;
    }

    for (int i = 0; i < n; i++) {
        char *argumente[9];
        int numar = 0;
        char *cuvant = strtok(linii[i], " ");
        while (cuvant != NULL && numar < 8) {
            argumente[numar] = cuvant;
            numar++;
            cuvant = strtok(NULL, " ");
        }
        argumente[numar] = NULL;

        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            if (numar > 0) {
                execvp(argumente[0], argumente);
            }
            _exit(127);
        }
    }

    for (int k = 0; k < n; k++) {
        int stare;
        pid_t gata = wait(&stare);
        for (int i = 0; i < n; i++) {
            if (pids[i] == gata) {
                coduri[i] = WEXITSTATUS(stare);
            }
        }
    }

    int trecute = 0;
    for (int i = 0; i < n; i++) {
        if (coduri[i] == 0) {
            printf("%d: trecut\n", i + 1);
            trecute++;
        } else if (coduri[i] == 127) {
            printf("%d: lipsa\n", i + 1);
        } else {
            printf("%d: picat\n", i + 1);
        }
    }
    printf("Trecute: %d din %d\n", trecute, n);
    return 0;
}
```
