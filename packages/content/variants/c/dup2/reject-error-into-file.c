#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

int main(void) {
    char line[128];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\n")] = 0;
        char *w[12]; int n = 0;
        for (char *t = strtok(line, " "); t && n < 11; t = strtok(NULL, " ")) w[n++] = t;
        w[n] = NULL;
        if (n < 2) continue;
        if (!strcmp(w[0], "show")) {
            char b[4096]; int fd = open(w[1], O_RDONLY); ssize_t k = read(fd, b, 4095); close(fd);
            b[k > 0 ? k : 0] = 0; printf("%s", b); continue;
        }
        int into = !strcmp(w[0], "run");
        fflush(stdout);
        pid_t p = fork();
        if (p == 0) {
            int fd = into ? open(w[1], O_WRONLY | O_CREAT | O_TRUNC, 0644) : open(w[1], O_RDONLY);
            dup2(fd, into ? 1 : 0); close(fd);
            execvp(w[2], w + 2);
            printf("%s: not found\n", w[2]);
            exit(127);
        }
        waitpid(p, NULL, 0);
        if (into) { struct stat st; stat(w[1], &st); printf("%s: %ld bytes\n", w[1], (long)st.st_size); }
    }
    return 0;
}
