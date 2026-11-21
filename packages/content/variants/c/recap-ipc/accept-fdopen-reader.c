#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char buf[256], copy[256];
    while (fgets(buf, sizeof buf, stdin)) {
        buf[strcspn(buf, "\n")] = 0;
        strcpy(copy, buf);
        char *argv[9];
        int k = 0;
        for (char *t = strtok(buf, " "); t && k < 8; t = strtok(NULL, " ")) argv[k++] = t;
        argv[k] = NULL;
        if (!k) continue;
        int p[2];
        pipe(p);
        fflush(stdout);
        pid_t c = fork();
        if (c == 0) { close(p[0]); dup2(p[1], 1); close(p[1]); execvp(argv[0], argv); _exit(127); }
        close(p[1]);
        char chunk[512], cur[128];
        int len = 0, lines = 0;
        long sum = 0;
        ssize_t n;
        while ((n = read(p[0], chunk, sizeof chunk)) > 0) {
            for (ssize_t i = 0; i < n; i++) {
                if (chunk[i] != '\n') { if (len < 127) cur[len++] = chunk[i]; continue; }
                cur[len] = 0;
                lines++;
                char *e;
                long v = strtol(cur, &e, 10);
                if (len && !*e) sum += v;
                len = 0;
            }
        }
        close(p[0]);
        int st;
        waitpid(c, &st, 0);
        printf("%s -> lines %d, sum %ld, exit %d\n", copy, lines, sum, WEXITSTATUS(st));
    }
    return 0;
}
