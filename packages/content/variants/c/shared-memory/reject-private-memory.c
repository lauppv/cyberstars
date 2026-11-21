#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int main(void) {
    int n, lim[8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &lim[i]);
    long *c = mmap(NULL, n * sizeof(long), PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            long k = 0;
            for (int x = 2; x <= lim[i]; x++) { int p = 1; for (int d = 2; d * d <= x; d++) if (x % d == 0) { p = 0; break; } k += p; }
            c[i] = k;
            exit(0);
        }
    }
    while (wait(NULL) > 0) {}
    long t = 0;
    for (int i = 0; i < n; i++) { printf("up to %d: %ld\n", lim[i], c[i]); t += c[i]; }
    printf("Total: %ld\n", t);
    munmap(c, n * sizeof(long));
    return 0;
}
