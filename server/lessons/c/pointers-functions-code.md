#include <stdio.h>

void triple_it(int *n) {
}

int main(void) {
    int num = 5;
    triple_it(&num);
    printf("%d\n", num);
    return 0;
}
