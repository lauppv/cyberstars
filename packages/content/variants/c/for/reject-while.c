#include <stdio.h>

int main(void) {
    int i = 0;
    while (i <= 100) {
        if (i == 10 || i == 50) printf("COFFEE\n");
        else printf("%d\n", i);
        i++;
    }
    return 0;
}
