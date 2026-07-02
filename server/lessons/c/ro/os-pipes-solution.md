```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];
    pipe(fd);

    pid_t pid = fork();

    if (pid == 0) {
        close(fd[0]);
        char mesaj[] = "Bell Labs";
        write(fd[1], mesaj, strlen(mesaj) + 1);
        close(fd[1]);
    } else {
        close(fd[1]);
        char buf[100];
        read(fd[0], buf, sizeof(buf));
        printf("Primit: %s\n", buf);
        close(fd[0]);
        wait(NULL);
    }

    return 0;
}
```
