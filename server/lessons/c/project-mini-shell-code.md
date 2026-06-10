#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void runCommand(const char *cmd) {
    pid_t pid = fork();

    if (pid == 0) {
        _exit(0);
    } else {
        wait(NULL);
        printf("Done\n");
    }
}

int main(void) {
    runCommand("greet");
    runCommand("count");
    runCommand("unknown");
    return 0;
}
