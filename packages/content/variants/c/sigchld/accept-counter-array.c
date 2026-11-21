#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

static volatile sig_atomic_t got, sum;

static void reap(int s) {
    (void)s;
    int e = errno, st;
    pid_t p;
    while ((p = waitpid(-1, &st, WNOHANG)) > 0) { got++; sum += WIFEXITED(st) ? WEXITSTATUS(st) : 0; }
    errno = e;
}

int main(void) {
    sigset_t chld, prev;
    sigemptyset(&chld);
    sigaddset(&chld, SIGCHLD);
    sigprocmask(SIG_BLOCK, &chld, &prev);
    struct sigaction sa = { 0 };
    sa.sa_handler = reap;
    sigaction(SIGCHLD, &sa, NULL);
    int n, c;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &c);
        fflush(stdout);
        if (fork() == 0) _exit(c);
    }
    while (got < n) sigsuspend(&prev);
    printf("Collected: %d\nTotal: %d\n", (int)got, (int)sum);
    return 0;
}
