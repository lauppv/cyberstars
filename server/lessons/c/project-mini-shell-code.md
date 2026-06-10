#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void run_command(const char *cmd) {
    pid_t pid = fork();

    if (pid == 0) {
        _exit(0);
    } else {
        wait(NULL);
        printf("Done\n");
    }
}

int main(void) {
    run_command("greet");
    run_command("count");
    run_command("unknown");
    return 0;
}
