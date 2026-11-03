#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        unsigned x;
        scanf("%u", &x);
        printf("%s\n", (__builtin_popcount(x) == 1) & 1 ? "YES" : "NO");
    }
    return 0;
}
