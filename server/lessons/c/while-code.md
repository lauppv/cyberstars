#include <stdio.h>

int main(void) {
    int is_online = 1;

    while (is_online) {
        printf("I am online\n");
    }

    printf("Now I am offline\n");
    return 0;
}
