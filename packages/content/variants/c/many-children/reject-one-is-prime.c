#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int n, v[8], res[8];
    pid_t pids[8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            int p = 1;
            for (int d = 2; d * d <= v[i]; d++) if (v[i] % d == 0) p = 0;
            exit(p);
        }
    }
    for (int k = 0; k < n; k++) {
        int st; pid_t done = wait(&st);
        for (int i = 0; i < n; i++) if (pids[i] == done) res[i] = WEXITSTATUS(st);
    }
    int c = 0;
    for (int i = 0; i < n; i++) { printf("%d: %s\n", v[i], res[i] ? "prime" : "not prime"); c += res[i]; }
    printf("Primes: %d\n", c);
    return 0;
}
