#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

static void parse(char *s, char **v) {
    int n = 0;
    for (char *save = NULL, *t = strtok_r(s, " ", &save); t && n < 8; t = strtok_r(NULL, " ", &save)) v[n++] = t;
    v[n] = NULL;
}

int main(void) {
    char buf[256];
    while (fgets(buf, sizeof buf, stdin)) {
        buf[strcspn(buf, "\n")] = 0;
        char *mid = strchr(buf, '|');
        if (!mid) continue;
        *mid = 0;
        char *a[9], *b[9];
        parse(buf, a);
        parse(mid + 1, b);
        int p[2];
        if (pipe(p)) return 1;
        fflush(stdout);
        pid_t x = fork();
        if (!x) { dup2(p[1], STDOUT_FILENO); close(p[0]); close(p[1]); execvp(a[0], a); _exit(127); }
        pid_t y = fork();
        if (!y) { dup2(p[0], STDIN_FILENO); close(p[0]); close(p[1]); execvp(b[0], b); _exit(127); }
        close(p[0]);
        close(p[1]);
        int sx, sy;
        waitpid(y, &sy, 0);
        waitpid(x, &sx, 0);
        printf("[exit %d]\n", WEXITSTATUS(sy));
    }
    return 0;
}
