#include <stdio.h>

void print_binary(int n) {
    char buf[40];
    int k = 0;
    do { buf[k++] = '0' + n % 2; n /= 2; } while (n > 0);
    while (k > 0) putchar(buf[--k]);
}

int count_ones(int n) {
    if (n == 0) return 0;
    return n % 2 + count_ones(n / 2);
}

int main(void) {
    int n;
    scanf("%d", &n);
    printf("Binary: ");
    print_binary(n);
    printf("\nOnes: %d\n", count_ones(n));
    return 0;
}
