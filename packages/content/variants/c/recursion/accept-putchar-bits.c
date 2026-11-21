#include <stdio.h>

void print_binary(int n) {
    if (n >= 2) print_binary(n >> 1);
    putchar('0' + (n & 1));
}

int count_ones(int n) {
    return n == 0 ? 0 : (n & 1) + count_ones(n >> 1);
}

int main(void) {
    int n;
    scanf("%d", &n);
    printf("Binary: ");
    print_binary(n);
    printf("\nOnes: %d\n", count_ones(n));
    return 0;
}
