#include <stdio.h>

int main(void) {
    int grades[] = {85, 42, 91, 67, 38, 73, 95, 55};
    int n = 8;

    printf("Passing: %d\n", count_passing(grades, n));
    printf("Highest: %d\n", find_max(grades, n));
    printf("First fail: %d\n", find_first_fail(grades, n));

    return 0;
}
