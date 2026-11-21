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
    struct sigaction sa;
    memset(&sa, 0, sizeof sa);
    sa.sa_handler = ring;
    sigaction(SIGALRM, &sa, NULL);
    char buf[256], shown[256];
    while (fgets(buf, sizeof buf, stdin)) {
        buf[strcspn(buf, "\n")] = 0;
        strcpy(shown, buf);
        char *argv[9];
        int k = 0;
        for (char *t = strtok(buf, " "); t && k < 8; t = strtok(NULL, " ")) argv[k++] = t;
        argv[k] = NULL;
        if (!k) continue;
        fflush(stdout);
        pid_t c = fork();
        if (!c) { execvp(argv[0], argv); _exit(127); }
        struct itimerval on = { .it_value = { 0, 500000 } }, off = { 0 };
        setitimer(ITIMER_REAL, &on, NULL);
        int st;
        pid_t r = waitpid(c, &st, 0);
        int interrupted = r < 0 && errno == EINTR;
        setitimer(ITIMER_REAL, &off, NULL);
        if (interrupted) {
            kill(c, SIGKILL);
            waitpid(c, &st, 0);
            printf("%s: timeout\n", shown);
        } else {
            printf("%s: exit %d\n", shown, WEXITSTATUS(st));
        }
    }
    return 0;
}
