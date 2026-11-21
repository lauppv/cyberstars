#include <stdio.h>

int counter(int step) {
    static int seen;
    return seen += step;
}

int fib(int n) {
    counter(1);
    return n <= 1 ? n : fib(n - 2) + fib(n - 1);
}

int main(void) {
    int k, n;
    scanf("%d", &k);
    while (k--) {
        scanf("%d", &n);
        int start = counter(0);
        int f = fib(n);
        printf("fib(%d) = %d, calls: %d\n", n, f, counter(0) - start);
    }
    return 0;
}
