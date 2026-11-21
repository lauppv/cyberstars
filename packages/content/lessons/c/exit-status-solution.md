```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int count_divisors(int x) {
    int count = 0;
    for (int d = 1; d <= x; d++) {
        if (x % d == 0) {
            count++;
        }
    }
    return count;
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
            _exit(count_divisors(x));
        }

        int status;
        waitpid(pid, &status, 0);
        if (WIFEXITED(status)) {
            printf("%d: exit %d\n", x, WEXITSTATUS(status));
        } else if (WIFSIGNALED(status)) {
            printf("%d: killed by signal %d\n", x, WTERMSIG(status));
        }
    }
    return 0;
}
```
