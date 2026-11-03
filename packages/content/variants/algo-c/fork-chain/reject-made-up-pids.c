#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    if (fork() == 0) {
        if (fork() == 0) {
            printf("Level 2 (grandchild): PID %d\n", 1002);
        } else {
            wait(NULL);
            printf("Level 1 (parent): PID %d\n", 1001);
        }
        return 0;
    }
    wait(NULL);
    printf("Level 0 (grandparent): PID %d\n", 1000);
    return 0;
}
