```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char line[128];
    char command[16];
    char name[32];
    char value[64];

    while (fgets(line, sizeof(line), stdin) != NULL) {
        int found = sscanf(line, "%15s %31s %63s", command, name, value);
        if (found < 2) {
            continue;
        }

        if (strcmp(command, "set") == 0 && found == 3) {
            setenv(name, value, 1);
        } else if (strcmp(command, "unset") == 0) {
            unsetenv(name);
        } else if (strcmp(command, "get") == 0) {
            char *v = getenv(name);
            if (v == NULL) {
                printf("%s is not set\n", name);
            } else {
                printf("%s=%s\n", name, v);
            }
        } else if (strcmp(command, "child") == 0) {
            fflush(stdout);
            pid_t pid = fork();
            if (pid == 0) {
                execlp("printenv", "printenv", name, NULL);
                _exit(127);
            }
            int status;
            waitpid(pid, &status, 0);
            if (WEXITSTATUS(status) == 1) {
                printf("%s is not set in the child\n", name);
            }
        }
    }
    return 0;
}
```
