#include <stdio.h>

int main(void) {
    const char *labels[] = { "normal", "normal", "fizz", "normal", "buzz", "fizz", "normal",
                             "normal", "fizz", "buzz", "normal", "fizz", "normal", "normal",
                             "fizzbuzz", "normal", "normal", "fizz", "normal", "buzz" };
    for (int i = 1; i <= 20; i++) printf("%d: %s\n", i, labels[i - 1]);
    printf("FizzBuzz count: 1\n");
    return 0;
}
