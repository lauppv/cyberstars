#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(void) {
    int fd[2];
    pipe(fd);
    char msg[] = "Bell Labs";
    write(fd[1], msg, strlen(msg) + 1);
    char buf[100];
    read(fd[0], buf, sizeof(buf));
    printf("Received: %s\n", buf);
    return 0;
}
