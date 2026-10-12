#include <stdio.h>

#define PI 3.14159
#define MAX_SIZE 100

static int AREA_RECT(int w, int h) { return w * h; }
static double AREA_CIRCLE(double r) { return PI * r * r; }

int main(void) {
    printf("Room: %d\n", AREA_RECT(5, 3));
    printf("Dish: %.2f\n", AREA_CIRCLE(4.0));
    printf("Limit: %d\n", MAX_SIZE);
    return 0;
}
