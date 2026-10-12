#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int r[100];
    int i = 0;
    while (i < n) { scanf("%d", &r[i]); i++; }
    int total = 0;
    i = 0;
    while (i < n) { printf("%d\n", r[i]); total += r[i]; i++; }
    printf("%d\n%f\n", total, (double) total / n);
    return 0;
}
