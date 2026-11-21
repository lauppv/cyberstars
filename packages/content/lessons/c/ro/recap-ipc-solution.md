```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

char iesire[65536];

int main(void) {
    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        char comanda[128];
        strcpy(comanda, linie);

        char *argumente[9];
        int numar = 0;
        char *cuvant = strtok(linie, " ");
        while (cuvant != NULL && numar < 8) {
            argumente[numar] = cuvant;
            numar++;
            cuvant = strtok(NULL, " ");
        }
        argumente[numar] = NULL;
        if (numar == 0) {
            continue;
        }

        int fd[2];
        pipe(fd);
        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) {
            dup2(fd[1], 1);
            close(fd[0]);
            close(fd[1]);
            execvp(argumente[0], argumente);
            _exit(127);
        }
        close(fd[1]);

        size_t total = 0;
        ssize_t n;
        while ((n = read(fd[0], iesire + total, sizeof(iesire) - 1 - total)) > 0) {
            total = total + n;
        }
        close(fd[0]);
        iesire[total] = '\0';

        int stare;
        waitpid(pid, &stare, 0);

        int linii = 0;
        long suma = 0;
        for (size_t i = 0; i < total; i++) {
            if (iesire[i] == '\n') {
                linii++;
            }
        }
        char *bucata = strtok(iesire, "\n");
        while (bucata != NULL) {
            char *sfarsit;
            long valoare = strtol(bucata, &sfarsit, 10);
            if (sfarsit != bucata && *sfarsit == '\0') {
                suma = suma + valoare;
            }
            bucata = strtok(NULL, "\n");
        }

        printf("%s -> linii %d, suma %ld, iesire %d\n", comanda, linii, suma, WEXITSTATUS(stare));
    }
    return 0;
}
```
