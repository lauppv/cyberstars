#include <stdio.h>

struct Tape {
    char label[50];
    int year, meters;
};

int main(void) {
    struct Tape shelf[2];
    int i = 0;
    while (i < 2 && scanf("%s %d %d", shelf[i].label, &shelf[i].year, &shelf[i].meters) == 3) i++;
    struct Tape *t = shelf;
    while (t < shelf + 2) {
        printf("%s (%d) - %d m\n", t->label, t->year, t->meters);
        t++;
    }
    return 0;
}
