#include <stdio.h>

int main(void) {
    static char word[100001];
    char c;
    scanf("%100000s", word);
    scanf("%c", &c);
    int count = 0;
    for (int i = 0; word[i]; i++) {
        if (word[i] == c) count++;
    }
    printf("%d\n", count);
    return 0;
}
