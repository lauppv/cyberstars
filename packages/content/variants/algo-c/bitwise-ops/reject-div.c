#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        unsigned x;
        scanf("%u", &x);
        int v = (int)x;
        while (v > 1 && div(v, 2).rem == 0) v = div(v, 2).quot;
        printf("%s\n", (v == 1) & 1 ? "YES" : "NO");
    }
    return 0;
}
