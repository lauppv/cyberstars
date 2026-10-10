#include <stdio.h>

int main(void) {
    int temperature = -5;
    puts(temperature < 0 ? "cold alert" : "temperature normal");
    return 0;
}
