```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>
#include <sys/wait.h>

volatile sig_atomic_t a_sunat = 0;

void la_alarma(int sig) {
    (void)sig;
    a_sunat = 1;
}

void porneste_ceas(long microsecunde) {
    struct itimerval ceas;
    memset(&ceas, 0, sizeof(ceas));
    ceas.it_value.tv_sec = microsecunde / 1000000;
    ceas.it_value.tv_usec = microsecunde % 1000000;
    setitimer(ITIMER_REAL, &ceas, NULL);
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_alarma;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        char comanda[128];
        strcpy(comanda, linie);

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
        pid_t pid = fork();
        if (pid == 0) {
            execvp(argumente[0], argumente);
            _exit(127);
        }

        a_sunat = 0;
        porneste_ceas(500000);
        int stare;
        pid_t gata = waitpid(pid, &stare, 0);
        porneste_ceas(0);

        if (gata == pid) {
            printf("%s: iesire %d\n", comanda, WEXITSTATUS(stare));
        } else if (errno == EINTR) {
            kill(pid, SIGKILL);
            waitpid(pid, &stare, 0);
            printf("%s: timp depasit\n", comanda);
        }
    }
    return 0;
}
```
