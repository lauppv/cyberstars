#include <stdio.h>

void triple_it(int *n) {
    *n = *n * 3;
}

int main(void) {
    int signal;
    scanf("%d", &signal);
    printf("%d\n", signal * 3);
    return 0;
}
