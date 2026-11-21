#include <stdio.h>

void print_binary(int n) {
    if (n == 0) return;
    print_binary(n / 2);
    printf("%d", n % 2);
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
