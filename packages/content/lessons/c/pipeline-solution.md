```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int split(char *text, char *args[]) {
    int count = 0;
    char *word = strtok(text, " ");
    while (word != NULL && count < 8) {
        args[count] = word;
        count++;
        word = strtok(NULL, " ");
    }
    args[count] = NULL;
    return count;
}

// end is 1 for the writer, whose stdout (1) becomes fd[1],
// and 0 for the reader, whose stdin (0) becomes fd[0]
pid_t start(char *args[], int fd[2], int end) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        dup2(fd[end], end);
        close(fd[0]);
        close(fd[1]);
        execvp(args[0], args);
        _exit(127);
    }
    return pid;
}

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char *bar = strstr(line, " | ");
        if (bar == NULL) {
            continue;
        }
        *bar = '\0';
        char *second = bar + 3;

        char *left_args[9];
        char *right_args[9];
        split(line, left_args);
        split(second, right_args);

        int fd[2];
        pipe(fd);
        pid_t left = start(left_args, fd, 1);
        pid_t right = start(right_args, fd, 0);
        close(fd[0]);
        close(fd[1]);

        int status;
        waitpid(left, NULL, 0);
        waitpid(right, &status, 0);
        printf("[exit %d]\n", WEXITSTATUS(status));
    }
    return 0;
}
```
