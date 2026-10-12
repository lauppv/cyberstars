#include <stdio.h>

static void report(int x, int y) {
    int both = x;
    both &= y;
    printf("%d\n%d\n%d\n%d\n", both, x | y, x ^ y, x << 2);
}

int main(void) {
    int x, y;
    scanf("%d%d", &x, &y);
    report(x, y);
    return 0;
}
