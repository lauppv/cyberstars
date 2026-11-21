#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

static void parse(char *s, char **v) { int n = 0; for (char *t = strtok(s, " "); t && n < 8; t = strtok(NULL, " ")) v[n++] = t; v[n] = NULL; }

int main(void) {
    char line[128];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\n")] = 0;
        char *bar = strstr(line, " | ");
        if (!bar) continue;
        *bar = 0;
        char *a[9], *b[9];
        parse(line, a);
        parse(bar + 3, b);
        int fd[2]; pipe(fd);
        fflush(stdout);
        pid_t x = fork();
        if (!x) { dup2(fd[1], 1); close(fd[0]); close(fd[1]); execvp(a[0], a); exit(127); }
        pid_t y = fork();
        if (!y) { dup2(fd[0], 0); close(fd[0]); close(fd[1]); execvp(b[0], b); exit(127); }
        close(fd[0]); close(fd[1]);
        int sx, sy; waitpid(x, &sx, 0); waitpid(y, &sy, 0);
        printf("[exit %d]\n", WEXITSTATUS(sx));
    }
    return 0;
}
