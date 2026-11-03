#include <stdio.h>

int main(void) {
    static char word[100001];
    scanf("%100000s", word);
    int length = 0;
    while (word[length] != '\0') {
        length++;
    }
    printf("%d\n", length + 1);
    return 0;
}
