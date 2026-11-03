#include <stdio.h>

static int power_of_two(long x) {
    return x > 0 && (x & -x) == x;
}

int main(void) {
    int n;
    scanf("%d", &n);
    while (n--) {
        long x;
        scanf("%ld", &x);
        puts(power_of_two(x) ? "YES" : "NO");
    }
    return 0;
}
