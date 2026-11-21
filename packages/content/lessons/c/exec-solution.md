```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char line[128];

    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        char *args[11];
        int count = 0;
        char *word = strtok(line, " ");
        while (word != NULL && count < 10) {
            args[count] = word;
            count++;
            word = strtok(NULL, " ");
        }
        args[count] = NULL;
        if (count == 0) {
            continue;
        }

        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) {
            execvp(args[0], args);
            printf("%s: command not found\n", args[0]);
            fflush(stdout);
            _exit(127);
        }

        int status;
        waitpid(pid, &status, 0);
        printf("[exit %d]\n", WEXITSTATUS(status));
    }
    return 0;
}
```
