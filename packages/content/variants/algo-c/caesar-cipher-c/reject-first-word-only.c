#include <stdio.h>

int main(void) {
    static char text[100001];
    int k;
    scanf("%100000s", text);
    scanf("%*[^\n]");
    scanf("%d", &k);
    for (int i = 0; text[i]; i++) {
        char c = text[i];
        if (c >= 'A' && c <= 'Z') c = 'A' + (c - 'A' + k) % 26;
        else if (c >= 'a' && c <= 'z') c = 'a' + (c - 'a' + k) % 26;
        putchar(c);
    }
    putchar('\n');
    return 0;
}
