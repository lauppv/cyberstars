#include <stdio.h>

typedef struct {
    char label[32];
    int year;
    int meters;
} Tape;

static void show(const Tape *t) {
    printf("%s (%d) - %d m\n", t->label, t->year, t->meters);
}

int main(void) {
    Tape first, second;
    scanf("%31s %d %d", first.label, &first.year, &first.meters);
    scanf("%31s %d %d", second.label, &second.year, &second.meters);
    show(&first);
    show(&second);
    return 0;
}
