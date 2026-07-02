```c
#include <stdio.h>

int main(void) {
    int numar_fizzbuzz = 0;

    for (int i = 1; i <= 20; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            printf("%d: fizzbuzz\n", i);
            numar_fizzbuzz++;
        } else if (i % 3 == 0) {
            printf("%d: fizz\n", i);
        } else if (i % 5 == 0) {
            printf("%d: buzz\n", i);
        } else {
            printf("%d: normal\n", i);
        }
    }

    printf("FizzBuzz count: %d\n", numar_fizzbuzz);
    return 0;
}
```
