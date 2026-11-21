```c
#include <stdio.h>

int counter(int step) {
    static int total = 0;
    total = total + step;
    return total;
}

int fib(int n) {
    counter(1);
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

int main(void) {
    int k;
    scanf("%d", &k);

    for (int i = 0; i < k; i++) {
        int n;
        scanf("%d", &n);
        int before = counter(0);
        int value = fib(n);
        int calls = counter(0) - before;
        printf("fib(%d) = %d, calls: %d\n", n, value, calls);
    }
    return 0;
}
```
