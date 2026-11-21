```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char lines[10][128];
    pid_t pids[10];
    int codes[10];
    int n = 0;

    while (n < 10 && fgets(lines[n], sizeof(lines[n]), stdin) != NULL) {
        lines[n][strcspn(lines[n], "\n")] = '\0';
        n++;
    }

    for (int i = 0; i < n; i++) {
        char *args[9];
        int count = 0;
        char *word = strtok(lines[i], " ");
        while (word != NULL && count < 8) {
            args[count] = word;
            count++;
            word = strtok(NULL, " ");
        }
        args[count] = NULL;

        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            if (count > 0) {
                execvp(args[0], args);
            }
            _exit(127);
        }
    }

    for (int k = 0; k < n; k++) {
        int status;
        pid_t done = wait(&status);
        for (int i = 0; i < n; i++) {
            if (pids[i] == done) {
                codes[i] = WEXITSTATUS(status);
            }
        }
    }

    int passed = 0;
    for (int i = 0; i < n; i++) {
        if (codes[i] == 0) {
            printf("%d: passed\n", i + 1);
            passed++;
        } else if (codes[i] == 127) {
            printf("%d: missing\n", i + 1);
        } else {
            printf("%d: failed\n", i + 1);
        }
    }
    printf("Passed: %d of %d\n", passed, n);
    return 0;
}
```
