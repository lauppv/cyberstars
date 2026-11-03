#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        printf("%s\n", (x == 1 || (x & 1) == 0) ? "YES" : "NO");
    }
    return 0;
}
