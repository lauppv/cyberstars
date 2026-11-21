#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

char output[65536];

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char command[128];
        strcpy(command, line);

        char *args[9];
        int count = 0;
        char *word = strtok(line, " ");
        while (word != NULL && count < 8) {
            args[count] = word;
            count++;
            word = strtok(NULL, " ");
        }
        args[count] = NULL;
        if (count == 0) {
            continue;
        }

        int fd[2];
        pipe(fd);
        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) {
            dup2(fd[1], 1);
            close(fd[0]);
            close(fd[1]);
            execvp(args[0], args);
            exit(127);
        }
        close(fd[1]);

        size_t total = 0;
        ssize_t n;
        while ((n = read(fd[0], output + total, sizeof(output) - 1 - total)) > 0) {
            total = total + n;
        }
        close(fd[0]);
        output[total] = '\0';

        int status;
        waitpid(pid, &status, 0);

        int lines = 0;
        long sum = 0;
        for (size_t i = 0; i < total; i++) {
            if (output[i] == '\n') {
                lines++;
            }
        }
        char *piece = strtok(output, "\n");
        while (piece != NULL) {
            char *end;
            long value = strtol(piece, &end, 10);
            if (end != piece) {
                sum = sum + value;
            }
            piece = strtok(NULL, "\n");
        }

        printf("%s -> lines %d, sum %ld, exit %d\n", command, lines, sum, WEXITSTATUS(status));
    }
    return 0;
}
