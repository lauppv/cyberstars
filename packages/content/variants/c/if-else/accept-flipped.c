#include <stdio.h>

int main(void) {
    int temperature = -5;
    if (temperature >= 0)
        puts("temperature normal");
    else
        puts("cold alert");
    return 0;
}
