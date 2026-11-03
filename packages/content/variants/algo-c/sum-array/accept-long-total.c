#include <stdio.h>

int main(void) {
    int n;
    long long total = 0;
    scanf("%d", &n);
    for (int x; n > 0 && scanf("%d", &x) == 1; n--) total += x;
    printf("%lld\n", total);
    return 0;
}
