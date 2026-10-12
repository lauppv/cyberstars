#include <stdio.h>

enum Season { SPRING, SUMMER, AUTUMN, WINTER };

static const char *names[] = { "Spring", "Summer", "Autumn", "Winter" };

void print_season(enum Season s) {
    switch (s) {
        case SPRING:
        case SUMMER:
        case AUTUMN:
        case WINTER:
            printf("%s\n", names[s]);
            break;
    }
}

int main(void) {
    enum Season order[] = { SPRING, SUMMER, AUTUMN, WINTER };
    for (int i = 0; i < 4; i++) print_season(order[i]);
    return 0;
}
