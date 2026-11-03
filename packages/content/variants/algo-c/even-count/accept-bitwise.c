#include <stdio.h>

int main(void) {
    int n, evens = 0;
    scanf("%d", &n);
    while (n--) {
        long x;
        scanf("%ld", &x);
        evens += !(x & 1);
    }
    printf("%d\n", evens);
    return 0;
}
