#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

void run_command(const char *command) {
    pid_t child = fork();
    if (child == 0) {
        if (strcmp(command, "time") == 0) printf("12:04\n");
        else if (strcmp(command, "space") == 0) printf("128K free\n");
        else printf("Unknown command: %s\n", command);
        fflush(stdout);
        _exit(0);
    }
    int status;
    wait(&status);
    printf("Done\n");
    fflush(stdout);
}

int main(void) {
    char cmd[50];
    int stop = 0;
    do {
        if (scanf("%49s", cmd) != 1 || strcmp(cmd, "exit") == 0) stop = 1;
        else run_command(cmd);
    } while (!stop);
    return 0;
}
