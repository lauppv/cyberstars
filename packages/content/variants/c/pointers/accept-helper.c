#include <stdio.h>

static void write_register(int *where, int value) {
    *where = value;
}

int main(void) {
    int x = 0;
    scanf("%d", &x);
    int *p = &x;
    write_register(p, 42);
    printf("%d\n", x);
    printf("%d\n", *p);
    return 0;
}
