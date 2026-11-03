#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t me = getpid();
    pid_t child = fork();
    if (child == 0) {
        printf("Child: my parent is %d\n", (int)me);
        return 0;
    }
    wait(NULL);
    printf("Parent: my child is %d\n", (int)child);
    return 0;
}
