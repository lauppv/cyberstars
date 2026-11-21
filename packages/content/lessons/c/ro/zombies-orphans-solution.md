```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

char starea(pid_t pid) {
    char cale[64];
    snprintf(cale, sizeof(cale), "/proc/%d/stat", pid);
    FILE *f = fopen(cale, "r");
    if (f == NULL) {
        return '-';
    }
    char stare = '?';
    fscanf(f, "%*d %*s %c", &stare);
    fclose(f);
    return stare;
}

int main(void) {
    int n;
    scanf("%d", &n);
    pid_t pids[5];

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            _exit((i + 1) * 10);
        }
    }

    for (int i = 0; i < n; i++) {
        siginfo_t info;
        waitid(P_PID, pids[i], &info, WEXITED | WNOWAIT);
        printf("copilul %d: %c\n", i + 1, starea(pids[i]));
    }

    for (int i = 0; i < n; i++) {
        int cod;
        waitpid(pids[i], &cod, 0);
        printf("copilul %d: iesire %d\n", i + 1, WEXITSTATUS(cod));
    }

    for (int i = 0; i < n; i++) {
        char stare = starea(pids[i]);
        if (stare == '-') {
            printf("copilul %d: disparut\n", i + 1);
        } else {
            printf("copilul %d: %c\n", i + 1, stare);
        }
    }
    return 0;
}
```
