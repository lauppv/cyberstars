#include <stdio.h>

int main(void) {
    int n, odds = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x % 2 == 1) odds++;
    }
    printf("%d\n", n - odds);
    return 0;
}
