```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char linie[128];

    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';

        char *argumente[11];
        int numar = 0;
        char *cuvant = strtok(linie, " ");
        while (cuvant != NULL && numar < 10) {
            argumente[numar] = cuvant;
            numar++;
            cuvant = strtok(NULL, " ");
        }
        argumente[numar] = NULL;
        if (numar == 0) {
            continue;
        }

        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) {
            execvp(argumente[0], argumente);
            printf("%s: comanda nu exista\n", argumente[0]);
            fflush(stdout);
            _exit(127);
        }

        int stare;
        waitpid(pid, &stare, 0);
        printf("[iesire %d]\n", WEXITSTATUS(stare));
    }
    return 0;
}
```
