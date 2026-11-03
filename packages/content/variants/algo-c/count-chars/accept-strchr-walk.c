#include <stdio.h>
#include <string.h>

int main(void) {
    static char word[100001];
    char c;
    scanf("%100000s %c", word, &c);
    int count = 0;
    for (char *p = strchr(word, c); p; p = strchr(p + 1, c)) count++;
    printf("%d\n", count);
    return 0;
}
