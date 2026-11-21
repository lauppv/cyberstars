#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int x;
    while (scanf("%d", &x) == 1) {
        pid_t pid = fork();
        if (pid == 0) {
            if (x < 0) abort();
            int c = 0;
            for (int d = 1; d <= x; d++) if (x % d == 0) c++;
            exit(c);
        }
        int status;
        waitpid(pid, &status, 0);
        if (WIFEXITED(status)) printf("%d: exit %d\n", x, WEXITSTATUS(status));
        else printf("%d: killed by signal %d\n", x, WTERMSIG(status));
    }
    fflush(stdout);
    return 0;
}
