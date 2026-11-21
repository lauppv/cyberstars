```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

void ruleaza(char *argumente[], const char *fisier, int spre_fisier) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        int fd;
        if (spre_fisier) {
            fd = open(fisier, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            dup2(fd, 1);
        } else {
            fd = open(fisier, O_RDONLY);
            dup2(fd, 0);
        }
        close(fd);
        execvp(argumente[0], argumente);
        perror(argumente[0]);
        _exit(127);
    }
    waitpid(pid, NULL, 0);
}

void arata(const char *fisier) {
    char buf[4096];
    int fd = open(fisier, O_RDONLY);
    if (fd == -1) {
        return;
    }
    ssize_t total = 0;
    ssize_t n;
    while ((n = read(fd, buf + total, sizeof(buf) - 1 - total)) > 0) {
        total = total + n;
    }
    close(fd);
    buf[total] = '\0';
    printf("%s", buf);
}

int main(void) {
    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        char *cuvinte[12];
        int numar = 0;
        char *cuvant = strtok(linie, " ");
        while (cuvant != NULL && numar < 11) {
            cuvinte[numar] = cuvant;
            numar++;
            cuvant = strtok(NULL, " ");
        }
        cuvinte[numar] = NULL;
        if (numar < 2) {
            continue;
        }

        if (strcmp(cuvinte[0], "show") == 0) {
            arata(cuvinte[1]);
        } else if (numar >= 3 && strcmp(cuvinte[0], "run") == 0) {
            ruleaza(cuvinte + 2, cuvinte[1], 1);
            struct stat st;
            stat(cuvinte[1], &st);
            printf("%s: %ld bytes\n", cuvinte[1], (long)st.st_size);
        } else if (numar >= 3 && strcmp(cuvinte[0], "feed") == 0) {
            ruleaza(cuvinte + 2, cuvinte[1], 0);
        }
    }
    return 0;
}
```
