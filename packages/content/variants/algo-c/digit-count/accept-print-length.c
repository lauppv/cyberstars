#include <stdio.h>

int main(void) {
    long n;
    char buf[32];
    scanf("%ld", &n);
    printf("%d\n", snprintf(buf, sizeof buf, "%ld", n));
    return 0;
}
