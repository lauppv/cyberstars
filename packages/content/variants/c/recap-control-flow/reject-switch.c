#include <stdio.h>

int main(void) {
    int count = 0;
    for (int i = 1; i <= 20; i++) {
        switch (i % 15) {
        case 0:
            printf("%d: fizzbuzz\n", i);
            count++;
            break;
        case 3: case 6: case 9: case 12:
            printf("%d: fizz\n", i);
            break;
        case 5: case 10:
            printf("%d: buzz\n", i);
            break;
        default:
            printf("%d: normal\n", i);
        }
    }
    printf("FizzBuzz count: %d\n", count);
    return 0;
}
