#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 4; i++) {
        printf("Thread %d printing\n", i);
        printf("Thread %d done\n", i);
    }
    printf("All jobs finished\n");
    return 0;
}
