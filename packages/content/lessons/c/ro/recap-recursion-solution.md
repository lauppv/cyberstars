```c
#include <stdio.h>

int contor(int pas) {
    static int total = 0;
    total = total + pas;
    return total;
}

int fib(int n) {
    contor(1);
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
        int inainte = contor(0);
        int valoare = fib(n);
        int apeluri = contor(0) - inainte;
        printf("fib(%d) = %d, apeluri: %d\n", n, valoare, apeluri);
    }
    return 0;
}
```
