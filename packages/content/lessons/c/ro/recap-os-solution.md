```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int numara_cuvinte(const char *text) {
    int cuvinte = 0;
    int in_cuvant = 0;

    for (int i = 0; text[i] != '\0'; i++) {
        if (text[i] == ' ') {
            in_cuvant = 0;
        } else if (!in_cuvant) {
            in_cuvant = 1;
            cuvinte++;
        }
    }

    return cuvinte;
}

int main(void) {
    int fd[2];
    pipe(fd);

    char text[] = "Vulpea bruna sare repede peste cainele lenes din curte";

    pid_t pid = fork();

    if (pid == 0) {
        close(fd[0]);
        int n = numara_cuvinte(text);
        char buf[32];
        sprintf(buf, "%d", n);
        write(fd[1], buf, strlen(buf) + 1);
        close(fd[1]);
    } else {
        close(fd[1]);
        char buf[32];
        read(fd[0], buf, sizeof(buf));
        printf("Copilul a numarat: %s cuvinte\n", buf);
        close(fd[0]);
        wait(NULL);
    }

    return 0;
}
```
