#include <stdio.h>

int main(void) {
    unsigned int first, second;
    scanf("%u", &first);
    scanf("%u", &second);
    unsigned int results[4] = { first & second, first | second, first ^ second, first << 2 };
    for (int i = 0; i < 4; i++) printf("%u\n", results[i]);
    return 0;
}
