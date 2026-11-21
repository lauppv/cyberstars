```c
#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t heard = 0;

void on_ring(int sig) {
    (void)sig;
    heard++;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_ring;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGUSR1, &sa, NULL);

    sigset_t bell;
    sigemptyset(&bell);
    sigaddset(&bell, SIGUSR1);

    char word[16];
    while (scanf("%15s", word) == 1) {
        if (strcmp(word, "ring") == 0) {
            raise(SIGUSR1);
        } else if (strcmp(word, "block") == 0) {
            sigprocmask(SIG_BLOCK, &bell, NULL);
        } else if (strcmp(word, "unblock") == 0) {
            sigprocmask(SIG_UNBLOCK, &bell, NULL);
        } else if (strcmp(word, "check") == 0) {
            sigset_t waiting;
            sigpending(&waiting);
            printf("heard %d, pending %s\n", heard,
                   sigismember(&waiting, SIGUSR1) ? "yes" : "no");
        }
    }

    sigprocmask(SIG_UNBLOCK, &bell, NULL);
    printf("Heard: %d\n", heard);
    return 0;
}
```
