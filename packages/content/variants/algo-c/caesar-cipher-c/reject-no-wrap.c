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
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) c = (char)(c + k);
        putchar(c);
    }
    putchar('\n');
    return 0;
}
