```c
#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t auzite = 0;

void la_sonerie(int sig) {
    (void)sig;
    auzite++;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_sonerie;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGUSR1, &sa, NULL);

    sigset_t sonerie;
    sigemptyset(&sonerie);
    sigaddset(&sonerie, SIGUSR1);

    char cuvant[16];
    while (scanf("%15s", cuvant) == 1) {
        if (strcmp(cuvant, "ring") == 0) {
            raise(SIGUSR1);
        } else if (strcmp(cuvant, "block") == 0) {
            sigprocmask(SIG_BLOCK, &sonerie, NULL);
        } else if (strcmp(cuvant, "unblock") == 0) {
            sigprocmask(SIG_UNBLOCK, &sonerie, NULL);
        } else if (strcmp(cuvant, "check") == 0) {
            sigset_t asteapta;
            sigpending(&asteapta);
            printf("auzite %d, in asteptare %s\n", auzite,
                   sigismember(&asteapta, SIGUSR1) ? "da" : "nu");
        }
    }

    sigprocmask(SIG_UNBLOCK, &sonerie, NULL);
    printf("Auzite: %d\n", auzite);
    return 0;
}
```
