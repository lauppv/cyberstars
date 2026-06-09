#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int numara_cuvinte(const char *text) {
    return 0;
}

int main(void) {
    int fd[2];
    pipe(fd);

    char text[] = "The quick brown fox jumps over the lazy dog";

    pid_t pid = fork();

    return 0;
}
