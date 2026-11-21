```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>
#include <sys/wait.h>

int n = 0;
pid_t pids[10];
volatile sig_atomic_t gata[10];
volatile sig_atomic_t coduri[10];
volatile sig_atomic_t stransi = 0;
volatile sig_atomic_t termen = 0;

void noteaza(pid_t pid, int stare) {
    for (int i = 0; i < n; i++) {
        if (pids[i] == pid) {
            gata[i] = 1;
            coduri[i] = WEXITSTATUS(stare);
            stransi++;
        }
    }
}

void la_copil(int sig) {
    (void)sig;
    int salvat = errno;
    int stare;
    pid_t pid;
    while ((pid = waitpid(-1, &stare, WNOHANG)) > 0) {
        noteaza(pid, stare);
    }
    errno = salvat;
}

void la_alarma(int sig) {
    (void)sig;
    termen = 1;
}

void instaleaza(int sig, void (*handler)(int)) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handler;
    sigemptyset(&sa.sa_mask);
    sigaction(sig, &sa, NULL);
}

int main(void) {
    instaleaza(SIGCHLD, la_copil);
    instaleaza(SIGALRM, la_alarma);

    sigset_t bloc, vechi;
    sigemptyset(&bloc);
    sigaddset(&bloc, SIGCHLD);
    sigaddset(&bloc, SIGALRM);
    sigprocmask(SIG_BLOCK, &bloc, &vechi);

    char linie[128];
    while (n < 10 && fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        char *argumente[9];
        int numar = 0;
        char *cuvant = strtok(linie, " ");
        while (cuvant != NULL && numar < 8) {
            argumente[numar] = cuvant;
            numar++;
            cuvant = strtok(NULL, " ");
        }
        argumente[numar] = NULL;
        if (numar == 0) {
            continue;
        }

        fflush(stdout);
        pids[n] = fork();
        if (pids[n] == 0) {
            sigprocmask(SIG_SETMASK, &vechi, NULL);
            execvp(argumente[0], argumente);
            _exit(127);
        }
        n++;
    }

    struct itimerval ceas;
    memset(&ceas, 0, sizeof(ceas));
    ceas.it_value.tv_usec = 500000;
    setitimer(ITIMER_REAL, &ceas, NULL);

    while (stransi < n && !termen) {
        sigsuspend(&vechi);
    }

    memset(&ceas, 0, sizeof(ceas));
    setitimer(ITIMER_REAL, &ceas, NULL);

    int oprite = 0;
    for (int i = 0; i < n; i++) {
        if (!gata[i]) {
            kill(pids[i], SIGTERM);
            waitpid(pids[i], NULL, 0);
            oprite++;
        }
    }

    for (int i = 0; i < n; i++) {
        if (gata[i]) {
            printf("%d: iesire %d\n", i + 1, coduri[i]);
        } else {
            printf("%d: oprita\n", i + 1);
        }
    }
    printf("Terminate: %d, oprite: %d\n", n - oprite, oprite);
    return 0;
}
```
