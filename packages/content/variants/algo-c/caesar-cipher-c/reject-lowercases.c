#include <ctype.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    static char text[100001];
    int k;
    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    scanf("%d", &k);
    for (int i = 0; text[i]; i++) {
        char c = text[i];
        if (isalpha((unsigned char)c)) c = 'a' + (tolower((unsigned char)c) - 'a' + k) % 26;
        putchar(c);
    }
    putchar('\n');
    return 0;
}
