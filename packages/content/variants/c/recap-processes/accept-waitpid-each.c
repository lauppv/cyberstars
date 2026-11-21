#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char buf[10][128];
    char *argv[10][9];
    pid_t pid[10];
    int n = 0;
    while (n < 10 && fgets(buf[n], sizeof buf[n], stdin)) {
        int k = 0;
        for (char *t = strtok(buf[n], " \n"); t && k < 8; t = strtok(NULL, " \n")) argv[n][k++] = t;
        argv[n][k] = NULL;
        n++;
    }
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if ((pid[i] = fork()) == 0) {
            if (argv[i][0]) execvp(argv[i][0], argv[i]);
            _exit(127);
        }
    }
    int ok = 0, code[10];
    for (int left = n; left > 0; left--) {
        int st;
        pid_t p = wait(&st);
        for (int i = 0; i < n; i++) if (pid[i] == p) code[i] = WIFEXITED(st) ? WEXITSTATUS(st) : -1;
    }
    for (int i = 0; i < n; i++) {
        const char *word = code[i] == 0 ? "passed" : code[i] == 127 ? "missing" : "failed";
        printf("%d: %s\n", i + 1, word);
        ok += code[i] == 0;
    }
    printf("Passed: %d of %d\n", ok, n);
    return 0;
}
