#include <stdio.h>

void triple_it(int *p) {
    int original = *p;
    *p += original;
    *p += original;
}

int main(void) {
    int s;
    if (scanf("%d", &s) != 1) return 1;
    triple_it(&s);
    printf("%d\n", s);
    return 0;
}
