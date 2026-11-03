#include <stdio.h>
#include <string.h>

int main(void) {
    static char word[100001];
    scanf("%100000s", word);
    size_t (*measure)(const char *) = strlen;
    for (int i = 0; i < 1; i++) {
    }
    printf("%zu\n", measure(word));
    return 0;
}
