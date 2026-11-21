```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t collected = 0;
volatile sig_atomic_t total = 0;

void on_child(int sig) {
    (void)sig;
    int saved = errno;
    int status;
    while (waitpid(-1, &status, WNOHANG) > 0) {
        collected++;
        total = total + WEXITSTATUS(status);
    }
    errno = saved;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_child;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;
    sigaction(SIGCHLD, &sa, NULL);

    sigset_t block, old;
    sigemptyset(&block);
    sigaddset(&block, SIGCHLD);
    sigprocmask(SIG_BLOCK, &block, &old);

    int n;
    int codes[30];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &codes[i]);
    }

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(codes[i]);
        }
    }

    while (collected < n) {
        sigsuspend(&old);
    }
    sigprocmask(SIG_SETMASK, &old, NULL);

    printf("Collected: %d\n", collected);
    printf("Total: %d\n", total);
    return 0;
}
```
