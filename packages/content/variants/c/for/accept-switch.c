#include <stdio.h>

int main(void) {
    for (int reel = 0; reel < 101; reel++) {
        switch (reel) {
        case 10:
        case 50:
            puts("COFFEE");
            break;
        default:
            printf("%d\n", reel);
        }
    }
    return 0;
}
