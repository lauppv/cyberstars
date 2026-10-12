#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

void sender(int fd[2]) {
    close(fd[0]);
    char msg[] = "Bell Labs";
    write(fd[1], msg, sizeof(msg));
    close(fd[1]);
}

void receiver(int fd[2]) {
    close(fd[1]);
    char buf[32] = {0};
    int total = 0, n;
    while ((n = read(fd[0], buf + total, sizeof(buf) - 1 - total)) > 0) total += n;
    close(fd[0]);
    printf("Received: %s\n", buf);
}

int main(void) {
    int fd[2];
    pipe(fd);
    pid_t p = fork();
    if (p == 0) {
        sender(fd);
    } else {
        receiver(fd);
        wait(NULL);
    }
    return 0;
}
