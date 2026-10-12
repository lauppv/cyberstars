#include <stdio.h>

enum Season { SPRING, SUMMER, AUTUMN, WINTER };

void print_season(enum Season season) {
    switch (season) {
    case SPRING:
        puts("Spring");
        break;
    case SUMMER:
        puts("Summer");
        break;
    case AUTUMN:
        puts("Autumn");
        break;
    default:
        puts("Winter");
    }
}

int main(void) {
    for (enum Season x = SPRING; x <= WINTER; x++)
        print_season(x);
    return 0;
}
