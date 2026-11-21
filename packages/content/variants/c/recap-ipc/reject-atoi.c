#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

char out[65536];

int main(void) {
    char line[128], cmd[128];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\n")] = 0;
        strcpy(cmd, line);
        char *a[9]; int k = 0;
        for (char *t = strtok(line, " "); t && k < 8; t = strtok(NULL, " ")) a[k++] = t;
        a[k] = NULL;
        if (!k) continue;
        int fd[2]; pipe(fd);
        fflush(stdout);
        pid_t p = fork();
        if (!p) { dup2(fd[1], 1); close(fd[0]); close(fd[1]); execvp(a[0], a); exit(127); }
        close(fd[1]);
        size_t t = 0; ssize_t n;
        while ((n = read(fd[0], out + t, sizeof out - 1 - t)) > 0) t += n;
        close(fd[0]); out[t] = 0;
        int st; waitpid(p, &st, 0);
        int lines = 0; long sum = 0;
        for (size_t i = 0; i < t; i++) if (out[i] == '\n') lines++;
        for (char *s = strtok(out, "\n"); s; s = strtok(NULL, "\n")) sum += atoi(s);
        printf("%s -> lines %d, sum %ld, exit %d\n", cmd, lines, sum, WEXITSTATUS(st));
        (void)strtol;
    }
    return 0;
}
