```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t stransi = 0;
volatile sig_atomic_t total = 0;

void la_copil(int sig) {
    (void)sig;
    int salvat = errno;
    int stare;
    while (waitpid(-1, &stare, WNOHANG) > 0) {
        stransi++;
        total = total + WEXITSTATUS(stare);
    }
    errno = salvat;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_copil;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;
    sigaction(SIGCHLD, &sa, NULL);

    sigset_t bloc, vechi;
    sigemptyset(&bloc);
    sigaddset(&bloc, SIGCHLD);
    sigprocmask(SIG_BLOCK, &bloc, &vechi);

    int n;
    int coduri[30];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &coduri[i]);
    }

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(coduri[i]);
        }
    }

    while (stransi < n) {
        sigsuspend(&vechi);
    }
    sigprocmask(SIG_SETMASK, &vechi, NULL);

    printf("Stransi: %d\n", stransi);
    printf("Total: %d\n", total);
    return 0;
}
```
