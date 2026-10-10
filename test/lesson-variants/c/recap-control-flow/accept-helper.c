#include <stdio.h>

const char *label_for(int n) {
    if (n % 3 == 0 && n % 5 == 0) return "fizzbuzz";
    if (n % 3 == 0) return "fizz";
    if (n % 5 == 0) return "buzz";
    return "normal";
}

int main(void) {
    int count = 0;
    for (int n = 1; n <= 20; n++) {
        const char *l = label_for(n);
        if (l[0] == 'f' && l[4] == 'b') count++;
        printf("%d: %s\n", n, l);
    }
    printf("FizzBuzz count: %d\n", count);
    return 0;
}
