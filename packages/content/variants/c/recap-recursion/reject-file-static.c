#include <stdio.h>

static int total = 0;

int counter(int step) {
    total += step;
    return total;
}

int fib(int n) {
    counter(1);
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main(void) {
    int k, n;
    scanf("%d", &k);
    for (int i = 0; i < k; i++) {
        scanf("%d", &n);
        int before = counter(0);
        int value = fib(n);
        printf("fib(%d) = %d, calls: %d\n", n, value, counter(0) - before);
    }
    return 0;
}
