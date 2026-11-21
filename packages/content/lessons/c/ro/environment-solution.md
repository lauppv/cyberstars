```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char linie[128];
    char comanda[16];
    char nume[32];
    char valoare[64];

    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        int gasite = sscanf(linie, "%15s %31s %63s", comanda, nume, valoare);
        if (gasite < 2) {
            continue;
        }

        if (strcmp(comanda, "set") == 0 && gasite == 3) {
            setenv(nume, valoare, 1);
        } else if (strcmp(comanda, "unset") == 0) {
            unsetenv(nume);
        } else if (strcmp(comanda, "get") == 0) {
            char *v = getenv(nume);
            if (v == NULL) {
                printf("%s nu e setata\n", nume);
            } else {
                printf("%s=%s\n", nume, v);
            }
        } else if (strcmp(comanda, "child") == 0) {
            fflush(stdout);
            pid_t pid = fork();
            if (pid == 0) {
                execlp("printenv", "printenv", nume, NULL);
                _exit(127);
            }
            int stare;
            waitpid(pid, &stare, 0);
            if (WEXITSTATUS(stare) == 1) {
                printf("%s nu e setata in copil\n", nume);
            }
        }
    }
    return 0;
}
```
