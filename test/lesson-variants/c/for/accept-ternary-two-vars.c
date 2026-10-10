#include <stdio.h>

int main(void) {
    int n;
    char buf[8];
    for (n = 0; n <= 100; n += 1) {
        snprintf(buf, sizeof buf, "%d", n);
        printf("%s\n", (n == 10 || n == 50) ? "COFFEE" : buf);
    }
    return 0;
}
