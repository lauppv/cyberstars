```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t usr1 = 0;
volatile sig_atomic_t usr2 = 0;

void on_usr1(int sig) {
    (void)sig;
    usr1++;
}

void on_usr2(int sig) {
    (void)sig;
    usr2++;
}

int main(void) {
    signal(SIGUSR1, on_usr1);
    signal(SIGUSR2, on_usr2);

    char word[16];
    while (scanf("%15s", word) == 1) {
        if (strcmp(word, "USR1") == 0) {
            raise(SIGUSR1);
        } else if (strcmp(word, "USR2") == 0) {
            raise(SIGUSR2);
        } else if (strcmp(word, "ignore") == 0) {
            signal(SIGUSR1, SIG_IGN);
        } else if (strcmp(word, "catch") == 0) {
            signal(SIGUSR1, on_usr1);
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
    int status;
    waitpid(pid, &status, 0);
    if (WIFSIGNALED(status)) {
        printf("child ended by signal %d\n", WTERMSIG(status));
    }
    return 0;
}
```
