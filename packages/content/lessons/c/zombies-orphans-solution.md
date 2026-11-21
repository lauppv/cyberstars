```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

char state_of(pid_t pid) {
    char path[64];
    snprintf(path, sizeof(path), "/proc/%d/stat", pid);
    FILE *f = fopen(path, "r");
    if (f == NULL) {
        return '-';
    }
    char state = '?';
    fscanf(f, "%*d %*s %c", &state);
    fclose(f);
    return state;
}

int main(void) {
    int n;
    scanf("%d", &n);
    pid_t pids[5];

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            _exit((i + 1) * 10);
        }
    }

    for (int i = 0; i < n; i++) {
        siginfo_t info;
        waitid(P_PID, pids[i], &info, WEXITED | WNOWAIT);
        printf("child %d: %c\n", i + 1, state_of(pids[i]));
    }

    for (int i = 0; i < n; i++) {
        int status;
        waitpid(pids[i], &status, 0);
        printf("child %d: exit %d\n", i + 1, WEXITSTATUS(status));
    }

    for (int i = 0; i < n; i++) {
        char state = state_of(pids[i]);
        if (state == '-') {
            printf("child %d: gone\n", i + 1);
        } else {
            printf("child %d: %c\n", i + 1, state);
        }
    }
    return 0;
}
```
