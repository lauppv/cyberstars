#include <stdio.h>

int main(void) {
    int value, count = 0, sum = 0;
    do {
        scanf("%d", &value);
        sum += value;
        count++;
    } while (value);
    printf("Cards: %d\nHoles: %d\n", count, sum);
    return 0;
}
