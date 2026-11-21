#include <stdio.h>
#include <string.h>

int main(void) {
    char card[100], who[40];
    int m, ok = 0, sum = 0;
    while (fgets(card, sizeof card, stdin)) {
        card[strcspn(card, "\n")] = 0;
        int got = sscanf(card, "%39s%d", who, &m);
        if (got != 2) { printf("Bad card: %s\n", card); continue; }
        ok++;
        sum += m;
    }
    printf("Jobs: %d\nMinutes: %d\n", ok, sum);
    return 0;
}
