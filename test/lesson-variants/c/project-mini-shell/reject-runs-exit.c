#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

void run_command(const char *command) {
    pid_t pid = fork();
    if (pid == 0) {
        if (strcmp(command, "time") == 0) printf("12:04\n");
        else if (strcmp(command, "space") == 0) printf("128K free\n");
        else printf("Unknown command: %s\n", command);
        fflush(stdout);
        _exit(0);
    }
    wait(NULL);
    printf("Done\n");
    fflush(stdout);
}

int main(void) {
    char command[50];
    while (scanf("%49s", command) == 1) {
        run_command(command);
        if (strcmp(command, "exit") == 0) break;
    }
    return 0;
}
