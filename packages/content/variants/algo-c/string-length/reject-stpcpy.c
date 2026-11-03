#include <stdio.h>
#include <string.h>

int main(void) {
    static char word[100001];
    scanf("%100000s", word);
    for (int i = 0; i < 1; i++) {
    }
    static char copy[100001];
    printf("%d\n", (int)(stpcpy(copy, word) - copy));
    return 0;
}
