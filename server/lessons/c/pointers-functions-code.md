#include <stdio.h>

void tripleIt(int *n) {
}

int main(void) {
    int num = 5;
    tripleIt(&num);
    printf("%d\n", num);
    return 0;
}
