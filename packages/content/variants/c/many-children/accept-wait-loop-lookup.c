#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

static int prime(long x) {
    if (x < 2) return 0;
    if (x % 2 == 0) return x == 2;
    for (long d = 3; d * d <= x; d += 2) if (x % d == 0) return 0;
    return 1;
}

int main(void) {
    int n, v[8], res[8] = {0};
    pid_t who[8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        who[i] = fork();
        if (!who[i]) _exit(prime(v[i]));
    }
    int st;
    pid_t p;
    while ((p = wait(&st)) > 0)
        for (int i = 0; i < n; i++) if (who[i] == p) res[i] = WEXITSTATUS(st);
    int c = 0;
    for (int i = 0; i < n; i++) { printf("%d: %s\n", v[i], res[i] ? "prime" : "not prime"); c += res[i]; }
    printf("Primes: %d\n", c);
    return 0;
}
