```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t usr1 = 0;
volatile sig_atomic_t usr2 = 0;

void la_usr1(int sig) {
    (void)sig;
    usr1++;
}

void la_usr2(int sig) {
    (void)sig;
    usr2++;
}

int main(void) {
    signal(SIGUSR1, la_usr1);
    signal(SIGUSR2, la_usr2);

    char cuvant[16];
    while (scanf("%15s", cuvant) == 1) {
        if (strcmp(cuvant, "USR1") == 0) {
            raise(SIGUSR1);
        } else if (strcmp(cuvant, "USR2") == 0) {
            raise(SIGUSR2);
        } else if (strcmp(cuvant, "ignore") == 0) {
            signal(SIGUSR1, SIG_IGN);
        } else if (strcmp(cuvant, "catch") == 0) {
            signal(SIGUSR1, la_usr1);
        }
    }

    printf("USR1: %d\n", usr1);
    printf("USR2: %d\n", usr2);

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        pause();
        _exit(0);
    }
    kill(pid, SIGTERM);
    int stare;
    waitpid(pid, &stare, 0);
    if (WIFSIGNALED(stare)) {
        printf("copilul oprit de semnalul %d\n", WTERMSIG(stare));
    }
    return 0;
}
```
