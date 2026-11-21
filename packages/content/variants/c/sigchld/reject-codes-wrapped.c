#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t collected = 0, total = 0;
void on(int s) { (void)s; int e = errno, st; while (waitpid(-1, &st, WNOHANG) > 0) { collected++; total += WEXITSTATUS(st); } errno = e; }

int main(void) {
    struct sigaction sa; memset(&sa, 0, sizeof sa); sa.sa_handler = on; sigaction(SIGCHLD, &sa, NULL);
    sigset_t b, o; sigemptyset(&b); sigaddset(&b, SIGCHLD); sigprocmask(SIG_BLOCK, &b, &o);
    int n, codes[30];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &codes[i]);
    for (int i = 0; i < n; i++) { fflush(stdout); if (fork() == 0) exit(codes[i] + 1); }
    while (collected < n) sigsuspend(&o);
    printf("Collected: %d\nTotal: %d\n", collected, total - n);
    return 0;
}
