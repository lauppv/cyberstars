#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    switch (fork()) {
    case 0:
        printf("Child: hello from PID %d\n", getpid());
        exit(0);
    default:
        wait(NULL);
        puts("Parent: child has finished");
    }
    return 0;
}
