#include <stdio.h>

int my_length(const char *s) {
    int n;
    for (n = 0; s[n] != '\0'; n++) {
    }
    return n;
}

int main(void) {
    static char buf[100001];
    if (scanf("%100000s", buf) != 1) return 1;
    printf("%d\n", my_length(buf));
    return 0;
}
