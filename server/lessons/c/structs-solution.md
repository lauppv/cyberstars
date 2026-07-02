```c
#include <stdio.h>

struct Tape {
    char label[50];
    int year;
    int meters;
};

int main(void) {
    struct Tape tapes[2];

    for (int i = 0; i < 2; i++) {
        scanf("%s %d %d", tapes[i].label, &tapes[i].year, &tapes[i].meters);
    }

    for (int i = 0; i < 2; i++) {
        printf("%s (%d) - %d m\n", tapes[i].label, tapes[i].year, tapes[i].meters);
    }
    return 0;
}
```
