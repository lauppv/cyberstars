#include <stdio.h>

int main(void) {
    int temperature = -5;
    switch (temperature < 0) {
    case 1:
        printf("cold alert\n");
        break;
    default:
        printf("temperature normal\n");
    }
    return 0;
}
