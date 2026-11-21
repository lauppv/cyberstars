#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

static volatile sig_atomic_t counts[2];

static void handler(int sig) { counts[sig == SIGUSR2]++; }

static void set(int sig, void (*h)(int)) {
    struct sigaction sa;
    memset(&sa, 0, sizeof sa);
    sa.sa_handler = h;
    sigemptyset(&sa.sa_mask);
    sigaction(sig, &sa, NULL);
}

int main(void) {
    set(SIGUSR1, handler);
    set(SIGUSR2, handler);
    char w[32];
    while (scanf("%31s", w) == 1) {
        if (!strcmp(w, "USR1")) raise(SIGUSR1);
        else if (!strcmp(w, "USR2")) raise(SIGUSR2);
        else if (!strcmp(w, "ignore")) signal(SIGUSR1, SIG_IGN);
        else if (!strcmp(w, "catch")) set(SIGUSR1, handler);
    }
    printf("USR1: %d\nUSR2: %d\n", (int)counts[0], (int)counts[1]);
    fflush(stdout);
    pid_t c = fork();
    if (!c) { for (;;) pause(); }
    kill(c, SIGTERM);
    int st;
    waitpid(c, &st, 0);
    printf("child ended by signal %d\n", WTERMSIG(st));
    return 0;
}
