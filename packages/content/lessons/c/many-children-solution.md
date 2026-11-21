```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int is_prime(int x) {
    if (x < 2) {
        return 0;
    }
    for (int d = 2; d * d <= x; d++) {
        if (x % d == 0) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int n;
    int numbers[8];
    pid_t pids[8];
    int results[8];

    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &numbers[i]);
    }

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            _exit(is_prime(numbers[i]));
        }
    }

    for (int k = 0; k < n; k++) {
        int status;
        pid_t done = wait(&status);
        for (int i = 0; i < n; i++) {
            if (pids[i] == done) {
                results[i] = WEXITSTATUS(status);
            }
        }
    }

    int primes = 0;
    for (int i = 0; i < n; i++) {
        printf("%d: %s\n", numbers[i], results[i] ? "prime" : "not prime");
        primes = primes + results[i];
    }
    printf("Primes: %d\n", primes);
    return 0;
}
```
