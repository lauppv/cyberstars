#include <ctype.h>
#include <stdio.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    char word[128];
    scanf("%127s", word);
    int fd[2];
    pipe(fd);
    if (fork() == 0) {
        close(fd[1]);
        char c;
        while (read(fd[0], &c, 1) == 1) putchar(toupper((unsigned char)c));
        putchar('\n');
        return 0;
    }
    close(fd[0]);
    write(fd[1], word, strlen(word));
    close(fd[1]);
    wait(NULL);
    return 0;
}
