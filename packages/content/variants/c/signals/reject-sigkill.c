#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t a = 0, b = 0;
void h1(int s) { (void)s; a++; }
void h2(int s) { (void)s; b++; }

int main(void) {
    signal(SIGUSR1, h1); signal(SIGUSR2, h2);
    char w[16];
    while (scanf("%15s", w) == 1) {
        if (!strcmp(w, "USR1")) raise(SIGUSR1);
        else if (!strcmp(w, "USR2")) raise(SIGUSR2);
        else if (!strcmp(w, "ignore")) signal(SIGUSR1, SIG_IGN);
        else if (!strcmp(w, "catch")) signal(SIGUSR1, h1);
    }
    printf("USR1: %d\nUSR2: %d\n", a, b);
    fflush(stdout);
    pid_t p = fork();
    if (!p) { pause(); exit(0); }
    kill(p, SIGKILL);
    int st; waitpid(p, &st, 0);
    printf("child ended by signal %d\n", WTERMSIG(st));
    return 0;
}
