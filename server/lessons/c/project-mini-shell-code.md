#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void runCommand(const char *cmd) {
    pid_t pid = fork();

    if (pid == 0) {
        // child: check cmd and run the right action
        // "greet" -> print "Hello from CyberStars!"
        // "count" -> print "1 2 3"
        // else -> print "Error: unknown command"

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
