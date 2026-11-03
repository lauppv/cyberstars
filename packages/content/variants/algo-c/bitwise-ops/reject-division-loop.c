#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        while (x % 2 == 0) x /= 2;
        printf("%s\n", (x == 1) & 1 ? "YES" : "NO");
    }
    return 0;
}
