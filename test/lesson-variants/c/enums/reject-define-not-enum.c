#include <stdio.h>

#define SPRING 0
#define SUMMER 1
#define AUTUMN 2
#define WINTER 3

void print_season(int s) {
    switch (s) {
        case SPRING: printf("Spring\n"); break;
        case SUMMER: printf("Summer\n"); break;
        case AUTUMN: printf("Autumn\n"); break;
        case WINTER: printf("Winter\n"); break;
    }
}

int main(void) {
    print_season(SPRING);
    print_season(SUMMER);
    print_season(AUTUMN);
    print_season(WINTER);
    return 0;
}
