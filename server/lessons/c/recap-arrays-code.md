#include <stdio.h>

// write your three functions here

int main(void) {
    int grades[] = {85, 42, 91, 67, 38, 73, 95, 55};
    int n = 8;

    printf("Passing: %d\n", countPassing(grades, n));
    printf("Highest: %d\n", findMax(grades, n));
    printf("First fail: %d\n", findFirstFail(grades, n));

    return 0;
}
