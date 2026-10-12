#include <stdio.h>

struct Tape {
    char label[50];
    int year;
    int meters;
};

int main(void) {
    struct Tape t;
    for (int i = 0; i < 2; i++) {
        scanf("%s %d %d", t.label, &t.year, &t.meters);
    }
    for (int i = 0; i < 2; i++) {
        printf("%s (%d) - %d m\n", t.label, t.year, t.meters);
    }
    return 0;
}
