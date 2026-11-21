```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

void run(char *args[], const char *file, int into) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        int fd;
        if (into) {
            fd = open(file, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            dup2(fd, 1);
        } else {
            fd = open(file, O_RDONLY);
            dup2(fd, 0);
        }
        close(fd);
        execvp(args[0], args);
        perror(args[0]);
        _exit(127);
    }
    waitpid(pid, NULL, 0);
}

void show(const char *file) {
    char buf[4096];
    int fd = open(file, O_RDONLY);
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
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char *words[12];
        int count = 0;
        char *word = strtok(line, " ");
        while (word != NULL && count < 11) {
            words[count] = word;
            count++;
            word = strtok(NULL, " ");
        }
        words[count] = NULL;
        if (count < 2) {
            continue;
        }

        if (strcmp(words[0], "show") == 0) {
            show(words[1]);
        } else if (count >= 3 && strcmp(words[0], "run") == 0) {
            run(words + 2, words[1], 1);
            struct stat st;
            stat(words[1], &st);
            printf("%s: %ld bytes\n", words[1], (long)st.st_size);
        } else if (count >= 3 && strcmp(words[0], "feed") == 0) {
            run(words + 2, words[1], 0);
        }
    }
    return 0;
}
```
