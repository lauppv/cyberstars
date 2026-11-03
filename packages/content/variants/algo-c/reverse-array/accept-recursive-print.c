#include <stdio.h>

static void backwards(int left, int first) {
    if (left == 0) return;
    int x;
    scanf("%d", &x);
    backwards(left - 1, 0);
    printf(first ? "%d" : "%d ", x);
}

int main(void) {
    int n;
    scanf("%d", &n);
    backwards(n, 1);
    putchar('\n');
    return 0;
}
