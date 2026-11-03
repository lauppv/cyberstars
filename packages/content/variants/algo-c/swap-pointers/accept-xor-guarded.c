#include <stdio.h>

static void exchange(int *p, int *q) {
    if (p == q) return;
    int keep = *p;
    *p = *q;
    *q = keep;
}

int main(void) {
    int first, second;
    scanf("%d %d", &first, &second);
    exchange(&first, &second);
    printf("%d %d\n", first, second);
    return 0;
}
