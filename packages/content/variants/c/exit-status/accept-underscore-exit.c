#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int x;
    while (scanf("%d", &x) == 1) {
        fflush(stdout);
        pid_t child = fork();
        if (child == 0) {
            if (x < 0) abort();
            int n = 0;
            for (int d = 1; d * d <= x; d++)
                if (x % d == 0) n += (d * d == x) ? 1 : 2;
            _exit(n);
        }
        int st;
        if (waitpid(child, &st, 0) != child) return 1;
        if (WIFSIGNALED(st)) printf("%d: killed by signal %d\n", x, WTERMSIG(st));
        else printf("%d: exit %d\n", x, WEXITSTATUS(st));
    }
    exit(0);
}
