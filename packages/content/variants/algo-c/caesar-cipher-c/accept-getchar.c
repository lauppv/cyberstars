#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    static char line[100002];
    int k;
    if (!fgets(line, sizeof line, stdin)) return 0;
    scanf("%d", &k);
    for (char *p = line; *p && *p != '\n'; p++) {
        if (isupper((unsigned char)*p)) putchar('A' + (*p - 'A' + k) % 26);
        else if (islower((unsigned char)*p)) putchar('a' + (*p - 'a' + k) % 26);
        else putchar(*p);
    }
    putchar('\n');
    return 0;
}
