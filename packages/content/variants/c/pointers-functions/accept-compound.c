#include <stdio.h>

void triple_it(int *target) {
    *target *= 3;
}

int main(void) {
    int value;
    scanf("%d", &value);
    int *where = &value;
    triple_it(where);
    printf("%d\n", *where);
    return 0;
}
