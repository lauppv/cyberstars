#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

static void child(char **argv, const char *file, int target) {
    int fd = target == 1 ? open(file, O_CREAT | O_TRUNC | O_WRONLY, 0600) : open(file, O_RDONLY);
    if (fd != target) { dup2(fd, target); close(fd); }
    execvp(argv[0], argv);
    perror(argv[0]);
    _exit(127);
}

int main(void) {
    char buf[256];
    while (fgets(buf, sizeof buf, stdin)) {
        char *w[16];
        int n = 0;
        for (char *t = strtok(buf, " \n"); t && n < 15; t = strtok(NULL, " \n")) w[n++] = t;
        w[n] = NULL;
        if (n < 2) continue;
        if (!strcmp(w[0], "show")) {
            FILE *f = fopen(w[1], "r");
            int c;
            while (f && (c = fgetc(f)) != EOF) putchar(c);
            if (f) fclose(f);
            continue;
        }
        int into = !strcmp(w[0], "run");
        fflush(stdout);
        pid_t p = fork();
        if (p == 0) child(w + 2, w[1], into ? 1 : 0);
        waitpid(p, NULL, 0);
        if (into) {
            int fd = open(w[1], O_RDONLY);
            struct stat st;
            fstat(fd, &st);
            close(fd);
            printf("%s: %lld bytes\n", w[1], (long long)st.st_size);
        }
    }
    return 0;
}
