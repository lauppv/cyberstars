```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

struct stage {
    char *args[16];
    char *in;
    char *out;
    int append;
};

int status = 0;

int parse(char *line, struct stage stages[]) {
    int count = 0;
    int argc = 0;
    memset(&stages[0], 0, sizeof(struct stage));
    char *word = strtok(line, " ");
    while (word != NULL) {
        if (strcmp(word, "|") == 0) {
            stages[count].args[argc] = NULL;
            count++;
            argc = 0;
            memset(&stages[count], 0, sizeof(struct stage));
        } else if (strcmp(word, "<") == 0) {
            stages[count].in = strtok(NULL, " ");
        } else if (strcmp(word, ">") == 0 || strcmp(word, ">>") == 0) {
            stages[count].append = strcmp(word, ">>") == 0;
            stages[count].out = strtok(NULL, " ");
        } else if (argc < 15) {
            stages[count].args[argc] = word;
            argc++;
        }
        word = strtok(NULL, " ");
    }
    stages[count].args[argc] = NULL;
    return count + 1;
}

void run(struct stage stages[], int count) {
    int in_fd = -1;
    if (stages[0].in != NULL) {
        in_fd = open(stages[0].in, O_RDONLY);
        if (in_fd == -1) {
            printf("%s: %s\n", stages[0].in, strerror(errno));
            status = 1;
            return;
        }
    }

    int pipes[3][2];
    for (int i = 0; i < count - 1; i++) {
        pipe(pipes[i]);
    }

    pid_t pids[4];
    for (int i = 0; i < count; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            if (i == 0 && in_fd != -1) {
                dup2(in_fd, 0);
            }
            if (i > 0) {
                dup2(pipes[i - 1][0], 0);
            }
            if (i < count - 1) {
                dup2(pipes[i][1], 1);
            }
            if (i == count - 1 && stages[i].out != NULL) {
                int flags = O_WRONLY | O_CREAT | (stages[i].append ? O_APPEND : O_TRUNC);
                int out_fd = open(stages[i].out, flags, 0644);
                dup2(out_fd, 1);
                close(out_fd);
            }
            for (int j = 0; j < count - 1; j++) {
                close(pipes[j][0]);
                close(pipes[j][1]);
            }
            if (in_fd != -1) {
                close(in_fd);
            }
            execvp(stages[i].args[0], stages[i].args);
            fprintf(stderr, "%s: command not found\n", stages[i].args[0]);
            _exit(127);
        }
    }

    for (int j = 0; j < count - 1; j++) {
        close(pipes[j][0]);
        close(pipes[j][1]);
    }
    if (in_fd != -1) {
        close(in_fd);
    }
    for (int i = 0; i < count; i++) {
        int s;
        waitpid(pids[i], &s, 0);
        if (i == count - 1) {
            status = WIFEXITED(s) ? WEXITSTATUS(s) : 128 + WTERMSIG(s);
        }
    }
}

int main(void) {
    char line[256];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        struct stage stages[4];
        int count = parse(line, stages);
        char **args = stages[0].args;
        if (args[0] == NULL) {
            continue;
        }

        if (strcmp(args[0], "exit") == 0) {
            break;
        } else if (strcmp(args[0], "status") == 0) {
            printf("%d\n", status);
        } else if (strcmp(args[0], "cd") == 0) {
            if (args[1] == NULL || chdir(args[1]) == -1) {
                printf("cd: %s: %s\n", args[1] ? args[1] : "", strerror(errno));
                status = 1;
            } else {
                status = 0;
            }
        } else {
            run(stages, count);
        }
    }
    return 0;
}
```
