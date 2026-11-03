#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t child = fork();
    if (child == 0) {
        printf("Child: my parent is %d\n", (int)getppid());
        return 0;
    }
    waitpid(child, NULL, 0);
    printf("Parent: my child is %d\n", (int)child);
    return 0;
}
