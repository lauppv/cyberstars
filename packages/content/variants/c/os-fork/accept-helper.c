#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

void diagnostic(void) {
    pid_t self = getpid();
    printf("Child: hello from PID %d\n", self);
}

int main(void) {
    pid_t child = fork();
    if (child > 0) {
        int status;
        wait(&status);
        printf("Parent: child has finished\n");
    } else if (child == 0) {
        diagnostic();
    }
    return 0;
}
