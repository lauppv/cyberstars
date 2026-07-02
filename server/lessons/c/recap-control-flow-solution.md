```c
#include <stdio.h>

int main(void) {
    int fizzbuzz_count = 0;

    for (int i = 1; i <= 20; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            printf("%d: fizzbuzz\n", i);
            fizzbuzz_count++;
        } else if (i % 3 == 0) {
            printf("%d: fizz\n", i);
        } else if (i % 5 == 0) {
            printf("%d: buzz\n", i);
        } else {
            printf("%d: normal\n", i);
        }
    }

    printf("FizzBuzz count: %d\n", fizzbuzz_count);
    return 0;
}
```
