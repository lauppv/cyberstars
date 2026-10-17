#include <stdio.h>

int main(void) {
    int a = 8;
    int b = 3;
    int c = 10;
    int d = 1;
    int e = 6;
    int *top = &a;
    printf("Root: %d\n", *top);
    printf("Children: %d %d\n", b, c);
    printf("Leaves: %d %d %d\n", d, e, c);
    return 0;
}
