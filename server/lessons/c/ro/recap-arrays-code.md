#include <stdio.h>

int main(void) {
    int note[] = {85, 42, 91, 67, 38, 73, 95, 55};
    int n = 8;

    printf("Passing: %d\n", numara_promovati(note, n));
    printf("Highest: %d\n", gaseste_max(note, n));
    printf("First fail: %d\n", gaseste_prima_cadere(note, n));

    return 0;
}
