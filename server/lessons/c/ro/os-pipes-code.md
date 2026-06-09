#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];
    pipe(fd);

    pid_t pid = fork();

    return 0;
}
