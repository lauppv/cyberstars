#include <stdio.h>
#include <string.h>

int main(void) {
    static char word[100001];
    scanf("%100000s", word);
    for (int i = 0; i < 1; i++) {
    }
    printf("%zu\n", strcspn(word, ""));
    return 0;
}
