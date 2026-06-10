#include <stdio.h>

void tripleaza(int *n) {
}

int main(void) {
    int numar = 5;
    tripleaza(&numar);
    printf("%d\n", numar);
    return 0;
}
