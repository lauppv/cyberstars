```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int numara_divizori(int x) {
    int numar = 0;
    for (int d = 1; d <= x; d++) {
        if (x % d == 0) {
            numar++;
        }
    }
    return numar;
}

int main(void) {
    int x;
    while (scanf("%d", &x) == 1) {
        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) {
            if (x < 0) {
                abort();
            }
            _exit(numara_divizori(x));
        }

        int stare;
        waitpid(pid, &stare, 0);
        if (WIFEXITED(stare)) {
            printf("%d: iesire %d\n", x, WEXITSTATUS(stare));
        } else if (WIFSIGNALED(stare)) {
            printf("%d: oprit de semnalul %d\n", x, WTERMSIG(stare));
        }
    }
    return 0;
}
```
