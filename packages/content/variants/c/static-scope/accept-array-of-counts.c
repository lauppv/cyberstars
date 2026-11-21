#include <stdio.h>

int take_ticket(char window) {
    static int counts[2];
    int k = window == 'P';
    return ++counts[k];
}

int main(void) {
    char w[64];
    scanf("%63s", w);
    for (char *p = w; *p; p++) {
        int t = take_ticket(*p);
        printf("%c%d\n", *p, t);
    }
    return 0;
}
