#include <stdio.h>

static char word[100001];

int main(void) {
    scanf("%100000s", word);
    const char *end = word;
    while (*end) {
        end++;
    }
    printf("%ld\n", (long)(end - word));
    return 0;
}
