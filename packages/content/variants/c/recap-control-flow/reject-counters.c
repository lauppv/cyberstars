#include <stdio.h>

int main(void) {
    int count = 0, three = 0, five = 0;
    for (int i = 1; i <= 20; i++) {
        three++;
        five++;
        if (three == 3 && five == 5) {
            printf("%d: fizzbuzz\n", i);
            count++;
        } else if (three == 3) {
            printf("%d: fizz\n", i);
        } else if (five == 5) {
            printf("%d: buzz\n", i);
        } else {
            printf("%d: normal\n", i);
        }
        if (three == 3) three = 0;
        if (five == 5) five = 0;
    }
    printf("FizzBuzz count: %d\n", count);
    return 0;
}
