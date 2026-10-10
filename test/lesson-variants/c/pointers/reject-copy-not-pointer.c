#include <stdio.h>

int main(void) {
    int x;
    scanf("%d", &x);
    int copy = x;
    copy = 42;
    int *ptr = &copy;
    printf("%d\n%d\n", x, *ptr);
    return 0;
}
