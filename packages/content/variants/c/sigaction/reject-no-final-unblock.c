#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t heard = 0;
void on(int s) { (void)s; heard++; }

int main(void) {
    struct sigaction sa; memset(&sa, 0, sizeof sa); sa.sa_handler = on; sigemptyset(&sa.sa_mask); sigaction(SIGUSR1, &sa, NULL);
    sigset_t b; sigemptyset(&b); sigaddset(&b, SIGUSR1);
    char w[16];
    while (scanf("%15s", w) == 1) {
        if (!strcmp(w, "ring")) raise(SIGUSR1);
        else if (!strcmp(w, "block")) sigprocmask(SIG_BLOCK, &b, NULL);
        else if (!strcmp(w, "unblock")) sigprocmask(SIG_UNBLOCK, &b, NULL);
        else { sigset_t p; sigpending(&p); printf("heard %d, pending %s\n", heard, sigismember(&p, SIGUSR1) ? "yes" : "no"); }
    }
    printf("Heard: %d\n", heard);
    return 0;
}
