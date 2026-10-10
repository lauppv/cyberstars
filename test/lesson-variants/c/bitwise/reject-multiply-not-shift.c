#include <stdio.h>

void report(int x, int y) {
    printf("%d\n%d\n%d\n%d\n", x & y, x | y, x ^ y, x * 4);
}

int main(void) {
    int x, y;
    scanf("%d%d", &x, &y);
    report(x, y);
    return 0;
}
