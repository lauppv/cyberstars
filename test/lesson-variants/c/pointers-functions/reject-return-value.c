#include <stdio.h>

int triple_it(int n) {
    return n * 3;
}

int main(void) {
    int signal;
    scanf("%d", &signal);
    signal = triple_it(signal);
    printf("%d\n", signal);
    return 0;
}
