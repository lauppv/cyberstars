#include <stdio.h>

int main(void) {
    int power[3];
    for (int i = 0; i < 3; i++)
        scanf("%d", &power[i]);
    size_t len = sizeof power / sizeof *power;
    printf("%zu\n%d\n%d\n", len, power[0], power[len - 1]);
    return 0;
}
