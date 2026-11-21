#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char cmd[16], name[32], value[64];
    while (scanf("%15s %31s", cmd, name) == 2) {
        if (!strcmp(cmd, "set")) { scanf("%63s", value); setenv(name, value, 0); }
        else if (!strcmp(cmd, "unset")) unsetenv(name);
        else if (!strcmp(cmd, "get")) { char *v = getenv(name); if (v) printf("%s=%s\n", name, v); else printf("%s is not set\n", name); }
        else {
            fflush(stdout);
            pid_t p = fork();
            if (p == 0) { execlp("printenv", "printenv", name, NULL); exit(127); }
            int st; waitpid(p, &st, 0);
            if (WEXITSTATUS(st) == 1) printf("%s is not set in the child\n", name);
        }
    }
    return 0;
}
