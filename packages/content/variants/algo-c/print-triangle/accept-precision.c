#include <stdio.h>

int main(void) {
    const char *stars = "********************";
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) printf("%.*s\n", i, stars);
    return 0;
}
