#include <stdio.h>

static long gcd(long a, long b) {
    return b ? gcd(b, a % b) : a;
}

int main(void) {
    long a, b;
    scanf("%ld %ld", &a, &b);
    long g = gcd(a, b);
    printf("GCD: %ld\nLCM: %ld\n", g, a * b / g);
    return 0;
}
