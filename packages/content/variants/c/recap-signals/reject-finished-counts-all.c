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
volatile sig_atomic_t done[10];
volatile sig_atomic_t codes[10];
volatile sig_atomic_t collected = 0;
volatile sig_atomic_t deadline = 0;

void record(pid_t pid, int status) {
    for (int i = 0; i < n; i++) {
        if (pids[i] == pid) {
            done[i] = 1;
            codes[i] = WEXITSTATUS(status);
            collected++;
        }
    }
}

void on_child(int sig) {
    (void)sig;
    int saved = errno;
    int status;
    pid_t pid;
    while ((pid = waitpid(-1, &status, WNOHANG)) > 0) {
        record(pid, status);
    }
    errno = saved;
}

void on_alarm(int sig) {
    (void)sig;
    deadline = 1;
}

void install(int sig, void (*handler)(int)) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handler;
    sigemptyset(&sa.sa_mask);
    sigaction(sig, &sa, NULL);
}

int main(void) {
    install(SIGCHLD, on_child);
    install(SIGALRM, on_alarm);

    sigset_t block, old;
    sigemptyset(&block);
    sigaddset(&block, SIGCHLD);
    sigaddset(&block, SIGALRM);
    sigprocmask(SIG_BLOCK, &block, &old);

    char line[128];
    while (n < 10 && fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
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
        pids[n] = fork();
        if (pids[n] == 0) {
            sigprocmask(SIG_SETMASK, &old, NULL);
            execvp(args[0], args);
            exit(127);
        }
        n++;
    }

    struct itimerval timer;
    memset(&timer, 0, sizeof(timer));
    timer.it_value.tv_usec = 500000;
    setitimer(ITIMER_REAL, &timer, NULL);

    while (collected < n && !deadline) {
        sigsuspend(&old);
    }

    memset(&timer, 0, sizeof(timer));
    setitimer(ITIMER_REAL, &timer, NULL);

    int stopped = 0;
    for (int i = 0; i < n; i++) {
        if (!done[i]) {
            kill(pids[i], SIGTERM);
            waitpid(pids[i], NULL, 0);
            stopped++;
        }
    }

    for (int i = 0; i < n; i++) {
        if (done[i]) {
            printf("%d: exit %d\n", i + 1, codes[i]);
        } else {
            printf("%d: stopped\n", i + 1);
        }
    }
    printf("Finished: %d, stopped: %d\n", n, stopped);
    return 0;
}
