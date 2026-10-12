#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int count_words(const char *text) {
    int spaces = 0;
    for (const char *p = text; *p; p++) {
        if (*p == ' ') spaces++;
    }
    return spaces + 1;
}

int main(void) {
    int link[2];
    pipe(link);

    char text[] = "The quick brown fox jumps over the lazy dog";

    if (fork() == 0) {
        close(link[0]);
        char digits[16];
        sprintf(digits, "%d", count_words(text));
        write(link[1], digits, sizeof(digits));
        close(link[1]);
        return 0;
    }
    close(link[1]);
    char got[16];
    read(link[0], got, sizeof(got));
    close(link[0]);
    wait(NULL);
    printf("Child counted: %s words\n", got);
    return 0;
}
