```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>
#include <sys/wait.h>

volatile sig_atomic_t rang = 0;

void on_alarm(int sig) {
    (void)sig;
    rang = 1;
}

void set_timer(long microseconds) {
    struct itimerval timer;
    memset(&timer, 0, sizeof(timer));
    timer.it_value.tv_sec = microseconds / 1000000;
    timer.it_value.tv_usec = microseconds % 1000000;
    setitimer(ITIMER_REAL, &timer, NULL);
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char command[128];
        strcpy(command, line);

        char *args[9];
        int count = 0;
        char *word = strtok(line, " ");
        while (word != NULL && count < 8) {
            args[count] = word;
            count++;
            word = strtok(NULL, " ");
        }
        args[count] = NULL;
        if (count == 0) {
            continue;
        }

        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) {
            execvp(args[0], args);
            _exit(127);
        }

        rang = 0;
        set_timer(500000);
        int status;
        pid_t done = waitpid(pid, &status, 0);
        set_timer(0);

        if (done == pid) {
            printf("%s: exit %d\n", command, WEXITSTATUS(status));
        } else if (errno == EINTR) {
            kill(pid, SIGKILL);
            waitpid(pid, &status, 0);
            printf("%s: timeout\n", command);
        }
    }
    return 0;
}
```
