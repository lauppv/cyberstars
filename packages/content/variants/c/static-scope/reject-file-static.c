#include <stdio.h>

static int runs = 0, prints = 0;

int take_ticket(char window) {
    if (window == 'R') return ++runs;
    return ++prints;
}

int main(void) {
    char line[64];
    scanf("%s", line);
    for (int i = 0; line[i] != '\0'; i++) printf("%c%d\n", line[i], take_ticket(line[i]));
    return 0;
}
