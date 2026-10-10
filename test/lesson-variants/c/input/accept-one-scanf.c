#include <stdio.h>

int main(void) {
    char who[32];
    int years;
    scanf("%31s %d", who, &years);
    int next = years + 1;
    printf("Hello %s, you are %d years old. Next year you will be %d\n", who, years, next);
    return 0;
}
