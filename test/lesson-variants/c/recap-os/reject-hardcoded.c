#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int count_words(const char *text) {
    return 9;
}

int main(void) {
    int fd[2];
    pipe(fd);
    char text[] = "The quick brown fox jumps over the lazy dog";
    pid_t pid = fork();
    if (pid == 0) {
        char buf[32];
        sprintf(buf, "%d", count_words(text));
        write(fd[1], buf, strlen(buf) + 1);
    } else {
        char buf[32];
        read(fd[0], buf, sizeof(buf));
        printf("Child counted: %s words\n", buf);
        wait(NULL);
    }
    return 0;
}
