#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin)) {
        line[strcspn(line, "\n")] = '\0';
        char *name = strtok(line, " ");
        if (!name) continue;
        char *args[] = { name, NULL };
        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) { execvp(args[0], args); printf("%s: command not found\n", args[0]); exit(127); }
        int status;
        waitpid(pid, &status, 0);
        printf("[exit %d]\n", WEXITSTATUS(status));
    }
    return 0;
}
