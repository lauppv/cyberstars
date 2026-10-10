#include <stdio.h>

#define PI 3.14159
#define MAX_SIZE 100
#define AREA_RECT(width, height) ((width) * (height))
#define AREA_CIRCLE(radius) ((PI) * (radius) * (radius))

int main(void) {
    int room = AREA_RECT(5, 3);
    double dish = AREA_CIRCLE(4.0);
    printf("Room: %d\nDish: %.2f\nLimit: %d\n", room, dish, MAX_SIZE);
    return 0;
}
