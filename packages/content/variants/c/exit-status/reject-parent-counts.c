#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int x;
    while (scanf("%d", &x) == 1) {
        fflush(stdout);
        pid_t pid = fork();
        if (pid == 0) exit(0);
        int status;
        waitpid(pid, &status, 0);
        if (x < 0) { printf("%d: killed by signal %d\n", x, WTERMSIG(status) + 6); continue; }
        int c = 0;
        for (int d = 1; d <= x; d++) if (x % d == 0) c++;
        printf("%d: exit %d\n", x, c + WEXITSTATUS(status));
    }
    (void)abort;
    return 0;
}
