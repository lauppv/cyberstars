#include <stdio.h>

int main(void) {
    int a, b, c, d;
    scanf("%d %d %d %d", &a, &b, &c, &d);
    if ((a || b) || (c && d)) printf("Access granted\n");
    else printf("Access denied\n");
    return 0;
}
