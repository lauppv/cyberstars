#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

static long count_primes(int limit) {
    if (limit < 2) return 0;
    char *comp = calloc(limit + 1, 1);
    long c = 0;
    for (int i = 2; i <= limit; i++) {
        if (comp[i]) continue;
        c++;
        for (long j = (long)i * i; j <= limit; j += i) comp[j] = 1;
    }
    free(comp);
    return c;
}

int main(void) {
    int n, lim[8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &lim[i]);
    size_t bytes = sizeof(long) * n;
    long *res = mmap(NULL, bytes, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (res == MAP_FAILED) return 1;
    pid_t kids[8];
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if ((kids[i] = fork()) == 0) { res[i] = count_primes(lim[i]); _exit(0); }
    }
    for (int i = 0; i < n; i++) wait(NULL);
    long sum = 0;
    for (int i = 0; i < n; i++) { printf("up to %d: %ld\n", lim[i], res[i]); sum += res[i]; }
    printf("Total: %ld\n", sum);
    munmap(res, bytes);
    return 0;
}
