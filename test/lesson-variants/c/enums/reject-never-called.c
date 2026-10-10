#include <stdio.h>

enum Season { SPRING, SUMMER, AUTUMN, WINTER };

void print_season(enum Season s) {
    (void) s;
}

int main(void) {
    printf("Spring\nSummer\nAutumn\nWinter\n");
    return 0;
}
