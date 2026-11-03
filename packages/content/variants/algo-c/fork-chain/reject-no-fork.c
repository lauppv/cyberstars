#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("Level 2 (grandchild): PID %d\n", getpid() + 2);
    printf("Level 1 (parent): PID %d\n", getpid() + 1);
    printf("Level 0 (grandparent): PID %d\n", getpid());
    return 0;
}
