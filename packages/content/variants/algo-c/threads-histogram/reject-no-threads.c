#include <stdio.h>

int main(void) {
    static char s[100001];
    int hist[26] = {0};
    scanf("%100000s", s);
    for (int i = 0; s[i]; i++) hist[s[i] - 'a']++;
    for (int i = 0; i < 26; i++) {
        if (hist[i] > 0) printf("%c: %d\n", 'a' + i, hist[i]);
    }
    return 0;
}
