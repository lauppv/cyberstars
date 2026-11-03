#include <stdio.h>

int main(void) {
    int n, count = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x % 2 != 0) count++;
    }
    printf("%d\n", count);
    return 0;
}
