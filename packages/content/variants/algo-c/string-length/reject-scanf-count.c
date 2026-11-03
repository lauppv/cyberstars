#include <stdio.h>

int main(void) {
    static char word[100001];
    int length = 0;
    scanf("%100000s%n", word, &length);
    printf("%d\n", length);
    return 0;
}
