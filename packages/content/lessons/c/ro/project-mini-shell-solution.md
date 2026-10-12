```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void ruleaza_comanda(const char *comanda) {
    pid_t pid = fork();

    if (pid == 0) {
        if (strcmp(comanda, "ora") == 0) {
            printf("12:04\n");
        } else if (strcmp(comanda, "spatiu") == 0) {
            printf("128K liber\n");
        } else {
            printf("Comanda necunoscuta: %s\n", comanda);
        }
        fflush(stdout);
        _exit(0);
    } else {
        wait(NULL);
        printf("Gata\n");
        fflush(stdout);
    }
}

int main(void) {
    char comanda[50];

    while (scanf("%49s", comanda) == 1) {
        if (strcmp(comanda, "iesire") == 0) {
            break;
        }
        ruleaza_comanda(comanda);
    }

    return 0;
}
```
