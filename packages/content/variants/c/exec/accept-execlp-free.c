#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

static int split(char *s, char **argv, int max) {
    int n = 0;
    for (char *t = strtok(s, " \n"); t && n < max; t = strtok(NULL, " \n")) argv[n++] = t;
    argv[n] = NULL;
    return n;
}

int main(void) {
    char buf[256];
    char *argv[16];
    while (fgets(buf, sizeof buf, stdin)) {
        if (split(buf, argv, 15) == 0) continue;
        fflush(stdout);
        pid_t p = fork();
        if (p < 0) return 1;
        if (!p) {
            execvp(*argv, argv);
            printf("%s: command not found\n", *argv);
            fflush(stdout);
            _exit(127);
        }
        int st = 0;
        waitpid(p, &st, 0);
        printf("[exit %d]\n", WIFEXITED(st) ? WEXITSTATUS(st) : 128 + WTERMSIG(st));
    }
    return 0;
}
