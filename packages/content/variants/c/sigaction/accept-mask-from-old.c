#include <stdio.h>
#include <string.h>
#include <signal.h>

static volatile sig_atomic_t n;
static void ring(int s) { (void)s; n++; }

int main(void) {
    struct sigaction sa = { 0 };
    sa.sa_handler = ring;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGUSR1, &sa, NULL);
    sigset_t one, pend;
    sigemptyset(&one);
    sigaddset(&one, SIGUSR1);
    char w[32];
    while (scanf("%31s", w) == 1) {
        switch (w[0]) {
        case 'r': raise(SIGUSR1); break;
        case 'b': sigprocmask(SIG_BLOCK, &one, NULL); break;
        case 'u': sigprocmask(SIG_UNBLOCK, &one, NULL); break;
        case 'c':
            sigpending(&pend);
            printf("heard %d, pending %s\n", (int)n, sigismember(&pend, SIGUSR1) == 1 ? "yes" : "no");
        }
    }
    sigprocmask(SIG_UNBLOCK, &one, NULL);
    printf("Heard: %d\n", (int)n);
    return 0;
}
