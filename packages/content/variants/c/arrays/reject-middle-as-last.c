#include <stdio.h>

int main(void) {
    int draw[3];
    scanf("%d %d %d", &draw[0], &draw[1], &draw[2]);
    printf("%d\n%d\n%d\n", (int) (sizeof(draw) / sizeof(draw[0])), draw[0], draw[1]);
    return 0;
}
