```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    // Grandparent forks the parent.
    pid_t p1 = fork();
    if (p1 == 0) {
        // We're in the parent. The parent forks the grandchild.
        pid_t p2 = fork();
        if (p2 == 0) {
            // Grandchild (level 2) prints first — it has no children to wait on.
            printf("Level 2 (grandchild): PID %d\n", getpid());
        } else {
            // Parent (level 1) waits for the grandchild, then prints.
            wait(NULL);
            printf("Level 1 (parent): PID %d\n", getpid());
        }
        return 0;
    }

    // Grandparent (level 0) waits for the parent, then prints last.
    wait(NULL);
    printf("Level 0 (grandparent): PID %d\n", getpid());
    return 0;
}
```
