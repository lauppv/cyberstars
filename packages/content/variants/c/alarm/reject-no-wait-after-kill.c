#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>
#include <sys/wait.h>

static void ring(int s) { (void)s; }

int main(void) {
    struct sigaction sa; memset(&sa, 0, sizeof sa); sa.sa_handler = ring; sigaction(SIGALRM, &sa, NULL);
    char line[128], cmd[128];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\n")] = 0; strcpy(cmd, line);
        char *a[9]; int k = 0;
        for (char *t = strtok(line, " "); t && k < 8; t = strtok(NULL, " ")) a[k++] = t;
        a[k] = NULL; if (!k) continue;
        fflush(stdout);
        pid_t p = fork();
        if (!p) { execvp(a[0], a); exit(127); }
        struct itimerval on = { .it_value = { 0, 500000 } }, off = { 0 };
        setitimer(ITIMER_REAL, &on, NULL);
        int st; pid_t d = waitpid(p, &st, 0);
        setitimer(ITIMER_REAL, &off, NULL);
        if (d == p) printf("%s: exit %d\n", cmd, WEXITSTATUS(st));
        else { kill(p, SIGTERM); printf("%s: killed\n", cmd); }
    }
    return 0;
}
