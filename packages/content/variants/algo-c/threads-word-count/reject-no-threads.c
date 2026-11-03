#include <stdio.h>

static int words(const char *s) {
    int n = 0, in = 0;
    for (; *s; s++) {
        if (*s != ' ' && *s != '\n') {
            if (!in) n++;
            in = 1;
        } else {
            in = 0;
        }
    }
    return n;
}

int main(void) {
    static char a[65536], b[65536];
    fgets(a, sizeof a, stdin);
    fgets(b, sizeof b, stdin);
    printf("Total words: %d\n", words(a) + words(b));
    return 0;
}
