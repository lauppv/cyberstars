#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int r[100];
    for (int i = 0; i < n; i++) scanf("%d", &r[i]);
    int total = 0;
    for (int i = 0; i < n; i++) { printf("%d\n", r[i]); total += r[i]; }
    printf("%d\n%f\n", total, (double) (total / n));
    return 0;
}
