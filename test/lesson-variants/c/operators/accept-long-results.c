#include <stdio.h>

int main(void) {
    long first, second;
    scanf("%ld %ld", &first, &second);
    long results[] = { first + second, first - second, first * second, first / second, first % second };
    for (int i = 0; i < 5; i++) printf("%ld\n", results[i]);
    return 0;
}
