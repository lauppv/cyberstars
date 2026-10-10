#include <stdio.h>

int main(void) {
    int draw[3];
    scanf("%d %d %d", &draw[0], &draw[1], &draw[2]);
    printf("3\n%d\n%d\n", draw[0], draw[2]);
    return 0;
}
