```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Copil: salut de la PID %d\n", getpid());
    } else {
        wait(NULL);
        printf("Parinte: copilul a terminat\n");
    }

    return 0;
}
```
