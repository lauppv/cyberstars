#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int count_words(const char *text) {
    int n = 0;
    while (*text) {
        while (*text == ' ') text++;
        if (*text) n++;
        while (*text && *text != ' ') text++;
    }
    return n;
}

static void child(int out, const char *line) {
    char buf[32];
    int len = sprintf(buf, "%d", count_words(line));
    write(out, buf, len);
    close(out);
    exit(0);
}

int main(void) {
    int fd[2];
    pipe(fd);

    char text[] = "The quick brown fox jumps over the lazy dog";

    pid_t pid = fork();
    if (pid == 0) {
        close(fd[0]);
        child(fd[1], text);
    }
    close(fd[1]);
    char buf[32];
    int got = 0, r;
    while ((r = read(fd[0], buf + got, sizeof(buf) - 1 - got)) > 0) got += r;
    buf[got] = '\0';
    close(fd[0]);
    waitpid(pid, NULL, 0);
    printf("Child counted: %s words\n", buf);
    return 0;
}
