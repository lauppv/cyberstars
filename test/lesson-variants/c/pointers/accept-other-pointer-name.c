#include <stdio.h>

int main(void) {
    int reg;
    scanf("%d", &reg);
    int *addr;
    addr = &reg;
    *addr = 42;
    printf("%d\n%d\n", reg, *addr);
    return 0;
}
