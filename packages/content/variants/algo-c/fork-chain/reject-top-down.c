#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    printf("Level 0 (grandparent): PID %d\n", getpid());
    fflush(stdout);
    if (fork() == 0) {
        printf("Level 1 (parent): PID %d\n", getpid());
        fflush(stdout);
        if (fork() == 0) {
            printf("Level 2 (grandchild): PID %d\n", getpid());
            return 0;
        }
        wait(NULL);
        return 0;
    }
    wait(NULL);
    return 0;
}
