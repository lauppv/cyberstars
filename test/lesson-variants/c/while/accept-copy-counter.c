#include <stdio.h>

int main(void) {
    int n = 5;
    int left = n;
    while (left >= 1) {
        printf("%d\n", left);
        left = left - 1;
    }
    puts("Start");
    return 0;
}
