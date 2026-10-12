```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int count_words(const char *text) {
    int words = 0;
    int in_word = 0;

    for (int i = 0; text[i] != '\0'; i++) {
        if (text[i] == ' ') {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;
            words++;
        }
    }

    return words;
}

int main(void) {
    int fd[2];
    pipe(fd);

    char text[] = "The quick brown fox jumps over the lazy dog";

    pid_t pid = fork();

    if (pid == 0) {
        close(fd[0]);
        int n = count_words(text);
        char buf[32];
        sprintf(buf, "%d", n);
        write(fd[1], buf, strlen(buf) + 1);
        close(fd[1]);
    } else {
        close(fd[1]);
        char buf[32];
        read(fd[0], buf, sizeof(buf));
        printf("Child counted: %s words\n", buf);
        close(fd[0]);
        wait(NULL);
    }

    return 0;
}
```
