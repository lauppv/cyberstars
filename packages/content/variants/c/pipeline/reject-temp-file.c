#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
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
        fflush(stdout);
        pid_t x = fork();
        if (!x) { int fd = open("tmp.out", O_WRONLY | O_CREAT | O_TRUNC, 0644); dup2(fd, 1); close(fd); execvp(a[0], a); exit(127); }
        waitpid(x, NULL, 0);
        pid_t y = fork();
        if (!y) { int fd = open("tmp.out", O_RDONLY); dup2(fd, 0); close(fd); execvp(b[0], b); exit(127); }
        int st; waitpid(y, &st, 0);
        printf("[exit %d]\n", WEXITSTATUS(st));
    }
    return 0;
}
