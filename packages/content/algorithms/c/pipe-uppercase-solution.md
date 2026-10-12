```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char word[128];
    scanf("%127s", word);

    // Create a pipe: p[0] is the read end, p[1] is the write end.
    int p[2];
    pipe(p);

    pid_t pid = fork();
    if (pid == 0) {
        // Child: close the write end (we won't use it).
        close(p[1]);
        char buf[128];
        int n = read(p[0], buf, sizeof(buf) - 1);
        buf[n] = '\0';
        // Uppercase every letter.
        for (int i = 0; buf[i]; i++) {
            buf[i] = toupper((unsigned char)buf[i]);
        }
        printf("%s\n", buf);
        close(p[0]);
    } else {
        // Parent: close the read end, send the word through the pipe,
        // then close the write end so the child sees end-of-stream.
        close(p[0]);
        write(p[1], word, strlen(word));
        close(p[1]);
        wait(NULL);
    }

    return 0;
}
```
