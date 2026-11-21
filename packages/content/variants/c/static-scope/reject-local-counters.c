#include <stdio.h>

int take_ticket(char window) {
    int runs = 0, prints = 0;
    if (window == 'R') return ++runs;
    return ++prints;
}

int main(void) {
    char line[64];
    scanf("%s", line);
    for (int i = 0; line[i] != '\0'; i++) printf("%c%d\n", line[i], take_ticket(line[i]));
    return 0;
}
