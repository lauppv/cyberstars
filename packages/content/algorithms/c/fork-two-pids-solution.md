```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    // fork() creates a second process identical to the first.
    // It returns 0 in the child and the child's PID in the parent.
    pid_t pid = fork();

    if (pid == 0) {
        // We are the child: getppid() gives us the parent's PID.
        printf("Child: my parent is %d\n", getppid());
    } else {
        // We are the parent: pid holds the child's PID.
        // We wait for the child to finish so the two lines print in order.
        wait(NULL);
        printf("Parent: my child is %d\n", pid);
    }

    return 0;
}
```
