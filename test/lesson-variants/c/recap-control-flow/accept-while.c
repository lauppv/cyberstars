#include <stdio.h>

int main(void) {
    int reel = 1, both = 0;
    while (reel <= 20) {
        const char *label = "normal";
        if (reel % 15 == 0) {
            label = "fizzbuzz";
            both++;
        } else if (reel % 3 == 0) {
            label = "fizz";
        } else if (reel % 5 == 0) {
            label = "buzz";
        }
        printf("%d: %s\n", reel, label);
        reel++;
    }
    printf("FizzBuzz count: %d\n", both);
    return 0;
}
