```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Child: hello from PID %d\n", getpid());
    } else {
        wait(NULL);
        printf("Parent: child has finished\n");
    }

    return 0;
}
```
