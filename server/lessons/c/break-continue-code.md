#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 20; i++) {
        // skip 13 with continue
        // stop at 17 with break (don't print 17)
        printf("%d\n", i);
    }
    return 0;
}
