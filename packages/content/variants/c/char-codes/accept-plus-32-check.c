#include <stdio.h>
#include <string.h>

int main(void) {
    char s[200];
    fgets(s, sizeof s, stdin);
    s[strcspn(s, "\n")] = 0;
    int total = 0;
    int i = 0;
    while (s[i]) {
        char c = s[i];
        if ('a' <= c && c <= 'z') c -= 32;
        else if ('0' <= c && c <= '9') total += c - 48;
        putchar(c);
        i++;
    }
    printf("\nDigit sum: %d\n", total);
    return 0;
}
