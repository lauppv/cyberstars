```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int imparte(char *text, char *argumente[]) {
    int numar = 0;
    char *cuvant = strtok(text, " ");
    while (cuvant != NULL && numar < 8) {
        argumente[numar] = cuvant;
        numar++;
        cuvant = strtok(NULL, " ");
    }
    argumente[numar] = NULL;
    return numar;
}

// capat e 1 pentru scriitor, al carui stdout (1) devine fd[1],
// si 0 pentru cititor, al carui stdin (0) devine fd[0]
pid_t porneste(char *argumente[], int fd[2], int capat) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        dup2(fd[capat], capat);
        close(fd[0]);
        close(fd[1]);
        execvp(argumente[0], argumente);
        _exit(127);
    }
    return pid;
}

int main(void) {
    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        char *bara = strstr(linie, " | ");
        if (bara == NULL) {
            continue;
        }
        *bara = '\0';
        char *a_doua = bara + 3;

        char *stanga_argumente[9];
        char *dreapta_argumente[9];
        imparte(linie, stanga_argumente);
        imparte(a_doua, dreapta_argumente);

        int fd[2];
        pipe(fd);
        pid_t stanga = porneste(stanga_argumente, fd, 1);
        pid_t dreapta = porneste(dreapta_argumente, fd, 0);
        close(fd[0]);
        close(fd[1]);

        int stare;
        waitpid(stanga, NULL, 0);
        waitpid(dreapta, &stare, 0);
        printf("[iesire %d]\n", WEXITSTATUS(stare));
    }
    return 0;
}
```
