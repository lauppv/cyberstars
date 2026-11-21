#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int main(void) {
    int n, lim[8];
    pid_t pids[8];
    long res[8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &lim[i]);
    long *unused = mmap(NULL, 8, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if ((pids[i] = fork()) == 0) {
            long k = 0;
            for (int x = 2; x <= lim[i]; x++) { int p = 1; for (int d = 2; d * d <= x; d++) if (x % d == 0) { p = 0; break; } k += p; }
            exit((int)k);
        }
    }
    for (int j = 0; j < n; j++) { int st; pid_t d = wait(&st); for (int i = 0; i < n; i++) if (pids[i] == d) res[i] = WEXITSTATUS(st); }
    long t = 0;
    for (int i = 0; i < n; i++) { printf("up to %d: %ld\n", lim[i], res[i]); t += res[i]; }
    printf("Total: %ld\n", t);
    munmap(unused, 8);
    return 0;
}
