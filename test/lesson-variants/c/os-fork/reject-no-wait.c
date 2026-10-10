#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Child: hello from PID %d\n", getpid());
    } else {
        sleep(1);
        printf("Parent: child has finished\n");
    }
    return 0;
}
