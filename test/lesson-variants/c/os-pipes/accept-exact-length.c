#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int ends[2];
    if (pipe(ends) == -1) return 1;

    if (fork() == 0) {
        const char *text = "Bell Labs";
        close(ends[0]);
        write(ends[1], text, strlen(text));
        close(ends[1]);
        return 0;
    }

    close(ends[1]);
    char line[64];
    ssize_t got = read(ends[0], line, sizeof(line) - 1);
    line[got > 0 ? got : 0] = '\0';
    close(ends[0]);
    wait(NULL);
    printf("Received: %s\n", line);
    return 0;
}
