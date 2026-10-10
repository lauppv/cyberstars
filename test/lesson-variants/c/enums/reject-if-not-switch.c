#include <stdio.h>

enum Season { SPRING, SUMMER, AUTUMN, WINTER };

void print_season(enum Season s) {
    if (s == SPRING) printf("Spring\n");
    else if (s == SUMMER) printf("Summer\n");
    else if (s == AUTUMN) printf("Autumn\n");
    else printf("Winter\n");
}

int main(void) {
    print_season(SPRING);
    print_season(SUMMER);
    print_season(AUTUMN);
    print_season(WINTER);
    return 0;
}
