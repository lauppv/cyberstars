#include <ctype.h>
#include <stdio.h>

int main(void) {
    static char word[100001];
    char c;
    scanf("%100000s %c", word, &c);
    int count = 0;
    for (int i = 0; word[i]; i++) {
        if (tolower((unsigned char)word[i]) == tolower((unsigned char)c)) count++;
    }
    printf("%d\n", count);
    return 0;
}
